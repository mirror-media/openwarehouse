const { getNewFilename, getFileDetail } = require('./fileDetailHandler')
const fetch = require('node-fetch');
const config = require('../configs/config')
const YOUTUBE_API_KEY = config.youtube.apiKey

const feedNewVideoData = (resolvedData) => {
    return new Promise((resolve, reject) => {
        try {
            resolvedData.file.filename = getNewFilename(resolvedData)
            resolvedData.meta = resolvedData.file._meta
            resolvedData.url = resolvedData.file._meta.url
            resolvedData.duration = resolvedData.file._meta.duration

            resolve()
        } catch (err) {
            reject()
        }
    })
}

const deleteOldVideoFileInGCSIfNeeded = async (
    existingItem,
    resolvedData,
    fileAdapter
) => {
    if (existingItem && existingItem.file) {
        if (resolvedData) {
            resolvedData.file = null
        }

        await fileAdapter.delete(
            existingItem.file.id,
            existingItem.file.originalFilename
        )
    }
}

const deleteVideoFileInGCS = async (existingItem, fileAdapter) => {
    if (existingItem && existingItem.file) {
        await fileAdapter.delete(
            existingItem.file.id,
            existingItem.file.originalFilename
        )
    }
}

const validateWhichKeyShouldCMSChoose = (
    existingItem,
    resolvedData,
    addValidationError,
    fileAdapter
) => {
    const { youtubeUrl, file } = resolvedData
    const { youtubeUrl: oldYoutubeUrl, file: oldFile } = existingItem || {}

    if (
        youtubeUrl &&
        file
        // (file && oldYoutubeUrl) ||
        // (youtubeUrl && oldFile)
    ) {
        // if has both, or conflict with prev data's video type
        // if validation fail, need to clear uploaded video in gcs
        deleteVideoFileInGCS(resolvedData, fileAdapter)
        addValidationError(
            '「Youtube網址」與「檔案」只能選擇一個作為影片來源，清除其中一個'
        )
        return false
    }

    if (youtubeUrl) {
        return 'youtubeUrl'
    } else if (file) {
        return 'file'
    } else if (existingItem && (oldYoutubeUrl || oldFile)) {
        return 'no-need-to-update'
    } else {
        addValidationError(
            '沒有影片來源，請在「Youtube網址」與「檔案」兩者中選擇一個作為影片來源'
        )
        return false
    }
}

const YouTubeDurationUtil = {
    //將 ISO 8601 格式轉換成秒數
    toSeconds(duration) {
        if (!duration) return 0
        const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
        const [, h = 0, m = 0, s = 0] = duration.match(regex) || []
        return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s)
    },

    // 將秒數轉換成 ISO 8601 格式
    fromSeconds(seconds) {
        if (!seconds || seconds <= 0) return 'PT0S'
        const h = Math.floor(seconds / 3600)
        const m = Math.floor((seconds % 3600) / 60)
        const s = seconds % 60
        return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}${s || (!h && !m) ? `${s}S` : ''}`
    },
}

// 從 YouTube 取得影片時長資訊
async function getYouTubeDuration(youtubeUrl) {
    try {
        if (!youtubeUrl) return null

        const match = youtubeUrl.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([^&\n?#]+)/
        )
        if (!match) return null

        const videoId = match[1]
        if (!YOUTUBE_API_KEY) {
            console.warn('YOUTUBE_API_KEY not found')
            return null
        }

        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${YOUTUBE_API_KEY}`
        )

        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`)

        const data = await response.json()
        if (!data.items?.length) return null

        const durationISO = data.items[0].contentDetails.duration
        const durationSeconds = YouTubeDurationUtil.toSeconds(durationISO)

        return { durationSeconds, durationISO }

    } catch (error) {
        console.error('Error in getYouTubeDuration:', error)
        return null
    }
}

const validateIfConflictWithStoredData = () => {}

module.exports = {
    deleteOldVideoFileInGCSIfNeeded,
    feedNewVideoData,
    validateWhichKeyShouldCMSChoose,

    YouTubeDurationUtil,
    getYouTubeDuration,
}
