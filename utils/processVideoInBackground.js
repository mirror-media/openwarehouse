const { getFileVideoDuration } = require('./getFileVideoDuration');
const { YouTubeDurationUtil } = require('./videoHandler');

async function processVideoInBackground(job, context) {
    try {
        const { videoId, fileInfo, action } = job;
        console.log(action, fileInfo)

        if (action === 'delete') {
            console.log(`[BG] Clear duration for video ${videoId}`);
            await context.executeGraphQL({
                query: `
                mutation UpdateVideo($id: ID!) {
                    updateVideo(
                    id: $id,
                    data: {
                        fileDuration_internal: "PT0S",
                        youtubeDuration_internal: "PT0S",
                        duration: 0
                    }
                    ) {
                    id
                    }
                }
                `,
                variables: { id: videoId },
            });
            return;
        }

        if (action === 'process' && fileInfo) {
            console.log(`[BG] Processing video file: ${fileInfo.filename}`);

            const durationSec = await getFileVideoDuration(fileInfo);
            const isoDuration = YouTubeDurationUtil.fromSeconds(durationSec ?? 0);

            await context.executeGraphQL({
                query: `
                mutation UpdateVideo($id: ID!, $fileDuration: String!, $youtubeDuration: String!, $durationInt: Int!) {
                    updateVideo(
                    id: $id,
                    data: {
                        fileDuration_internal: $fileDuration,
                        youtubeDuration_internal: $youtubeDuration,
                        duration: $durationInt
                    }
                    ) {
                    id
                    }
                }
                `,
                variables: {
                    id: videoId,
                    fileDuration: isoDuration,
                    youtubeDuration: 'PT0S',
                    durationInt: durationSec ?? 0,
                },
            });

            console.log(`[BG] File duration stored for video ${videoId}`);
        }
    } catch (err) {
        console.error('Background video processing error:', err);
    }
}

module.exports = { processVideoInBackground };
