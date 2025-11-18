const videoWorker = require('./videoWorker');

if (global.videoWorkerStarted) return;
global.videoWorkerStarted = true;

function startEmbeddedWorker() {
    console.log('[Bootstrap] Embedded video worker starting...');
    // 綁定事件監聽
    videoWorker.on('completed', job =>
        console.log(`[Worker] (embedded) Job completed: ${job.id}`)
    );
    videoWorker.on('failed', (job, err) =>
        console.error(`[Worker] (embedded) Job failed: ${job?.id}`, err)
    );
    console.log('[Bootstrap] Embedded video worker initialized');
}
module.exports = { startEmbeddedWorker };
