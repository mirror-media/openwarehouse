const { Queue, QueueEvents } = require('bullmq');
const config = require('../configs/config');

let videoQueue;
let videoQueueEvents;

if (config.redis && config.redis.type && config.redis.nodes?.length > 0) {
    const redisHost = config.redis.nodes[0].host || '127.0.0.1';
    const redisPort = config.redis.nodes[0].port || 6379;
    const redisPassword = config.redis.options?.authPass || undefined;

    const connection = {
        host: redisHost,
        port: redisPort,
        password: redisPassword,
    };

    videoQueue = new Queue('video-processing', { connection });
    videoQueueEvents = new QueueEvents('video-processing', { connection });

    console.log(`Video queue initialized (Redis: ${redisHost}:${redisPort})`);
} else {
    console.log('Redis not configured, video queue disabled (running in local mode)');
    // Local 模式用假的 queue
    videoQueue = {
        add: async (jobName, data) => {
            console.log(`Fake queue add called: ${jobName}`, data);
            return {
                id: 'local-fake-job',
                waitUntilFinished: async () => {
                    console.log('Fake waitUntilFinished called');
                    return data; // 回傳原始資料
                },
            };
        },
    };
    videoQueueEvents = null;
}

module.exports = { videoQueue, videoQueueEvents };
