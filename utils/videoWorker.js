const { Worker } = require('bullmq');
const { getFileVideoDuration } = require('./getFileVideoDuration');
const { YouTubeDurationUtil } = require('./videoHandler');
const config = require('../configs/config');

// === Redis Connection ===
let connection = null;
if (config.redis && config.redis.type && config.redis.nodes?.length > 0) {
    connection = {
        host: config.redis.nodes[0].host,
        port: config.redis.nodes[0].port,
        password: config.redis.options?.authPass || undefined,
    };
    console.log('[Worker] Redis connection configured:', connection);
    } else {
    console.log('⚠ Redis not configured, worker will not run (local mode)');
}

// === Worker ===
const videoWorker = new Worker(
    'video-processing',
    async job => {
        const { videoId, file, action } = job.data;
        console.log(`[Worker] Received job ${job.id}:`, job.data);

        try {
        if (action === 'process') {
            if (!file) {
            console.warn(`[Worker] No file provided for video ${videoId}, skipping`);
            return { videoId, durationSec: 0, isoDuration: 'PT0S' };
            }

            console.log(`[Worker] Start processing video: ${file.filename || file}`);
            // 計算影片秒數
            const durationSec = await getFileVideoDuration(file);
            const isoDuration = YouTubeDurationUtil.fromSeconds(durationSec ?? 0);

            console.log(`[Worker] Video processed: ${videoId}`);
            console.log(`   Duration (sec): ${durationSec}`);
            console.log(`   ISO Duration: ${isoDuration}`);

            // 回傳結果給 hook 去更新 DB
            return { videoId, durationSec, isoDuration };
        }

        if (action === 'delete') {
            console.log(`[Worker] Clear action for video ${videoId}`);
            return { videoId, durationSec: 0, isoDuration: 'PT0S' };
        }
        } catch (err) {
        console.error(`[Worker] Error processing video ${videoId}:`, err);
        throw err;
        }
    },
    {
        connection,
        concurrency: 2,
    }
);

// === Log events ===
videoWorker.on('completed', (job, result) => {
    console.log(`[Worker] Job completed: ${job.id}`, result);
    });

    videoWorker.on('failed', (job, err) => {
    console.error(`[Worker] Job failed: ${job?.id}`, err);
});

module.exports = videoWorker;
