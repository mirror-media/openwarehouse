const path = require('path')
const fs = require('fs')
const os = require('os')
const ffmpeg = require('fluent-ffmpeg')
const config = require('../configs/config');

// 判斷是否 URL
function isURL(str) {
        return /^(https?|file):\/\//.test(str);
    }

    // 生成 public URL (GCS)
    function getFileURL(bucket, basePath, filename) {
    if (!bucket || !basePath || !filename) return ''
    const cleanBase = basePath.startsWith('/') ? basePath.slice(1) : basePath
    return `https://storage.googleapis.com/${bucket}/${cleanBase}/${filename}`;
}

// env config
const envVar = {
    videos: {
        storagePath: path.join(os.homedir(), 'Downloads', 'uploads'), // 本機影片存放路徑
        baseUrl: config.storage?.videoUrlBase || '',                  // 影片遠端 URL
    },
    gcs: {
        bucket: config.storage?.bucket || '',
    },
}

// ffprobe util
function getVideoDurationFromPath(filePath) {
    return new Promise(resolve => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
        if (err) {
            console.error(`ffprobe error`, err)
            return resolve(null)
        }
        const duration = Math.floor(metadata?.format?.duration || 0)
        console.log(`Duration: ${duration}s`)
        resolve(duration)
        })
    })
}

// Main function — Check URL / local first
async function getFileVideoDuration(fileInfo) {
    if (!fileInfo) return null
    
    const filename = fileInfo?.filename;
    const fileUrl = fileInfo?._meta?.url || fileInfo?.url;

    // Case 1: URL (file:/// 或 http[s]://)
    if (fileUrl && isURL(fileUrl)) {
        console.log(`URL detected → ffprobe: ${fileUrl}`);
        return await getVideoDurationFromPath(fileUrl);
    }

    // Case 2: Try GCS (if configured)
    if (envVar.gcs.bucket && filename) {
        console.log(`Falling back to GCS bucket...`)
        const tempPath = await downloadFromGCS(filename)
        if (!tempPath) return null

        try {
            const duration = await getVideoDurationFromPath(tempPath)
            fs.unlinkSync(tempPath)
            return duration
        } catch (err) {
            if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath)
            return null
        }
    }

    console.log(`No file source available → return null`)
    return null
}

// Download from GCS (with retry & backoff)
async function downloadFromGCS(filename) {
    const maxRetries = 5
    const baseDelay = 500
    const maxTotalTime = 2 * 60 * 1000
    const startTime = Date.now()

    const videoUrl = getFileURL(envVar.gcs.bucket, envVar.videos.baseUrl, filename)
    console.log(`[GCS] Downloading: ${videoUrl}`)

    for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
        const fetch = require('node-fetch')
        const res = await fetch(videoUrl)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const tempPath = path.join(os.tmpdir(), `video_${Date.now()}_${filename}`)
        const buffer = await res.buffer()
        fs.writeFileSync(tempPath, buffer)

        console.log(`Downloaded to temp: ${tempPath}`)
        return tempPath
        } catch (err) {
        const elapsed = Date.now() - startTime
        if (elapsed >= maxTotalTime) break

        const delay = baseDelay * Math.pow(2, attempt)
        console.log(`Retry ${attempt + 1}/${maxRetries} in ${delay}ms`, err)
        await new Promise(r => setTimeout(r, delay))
        }
    }

    console.log(`Failed to download from GCS`)
    return null
}

module.exports = { getFileVideoDuration }
