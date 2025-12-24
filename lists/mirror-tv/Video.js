const path = require('path')
const {
    Text,
    Checkbox,
    Select,
    Relationship,
    File,
    Url,
    Integer,
} = require('@keystonejs/fields')
const NewDateTime = require('../../fields/NewDateTime/index.js')
const CustomRelationship = require('../../fields/CustomRelationship')

const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const { GCSAdapter } = require('../../lib/GCSAdapter')
const {
    admin,
    bot,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')
const { cronService } = require('../../configs/config.js')
const mediaUrlBase = 'assets/videos/'
const fileAdapter = new GCSAdapter(mediaUrlBase)

const {
    getNewFilename,
    getFileDetail,
} = require('../../utils/fileDetailHandler')
const {
    deleteOldVideoFileInGCSIfNeeded,
    feedNewVideoData,
    validateWhichKeyShouldCMSChoose,
    YouTubeDurationUtil,
    getYouTubeDuration,
} = require('../../utils/videoHandler')

const { videoQueue, videoQueueEvents } = require('../../utils/videoQueue')
const {
    processVideoInBackground,
} = require('../../utils/processVideoInBackground')

module.exports = {
    fields: {
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        youtubeUrl: {
            label: 'Youtube網址',
            type: Text,
        },
        file: {
            label: '檔案',
            type: File,
            adapter: fileAdapter,
        },
        categories: {
            label: '分類',
            type: Relationship,
            ref: 'Category',
            many: true,
        },
        coverPhoto: {
            label: '封面照片',
            type: Relationship,
            ref: 'Image',
        },
        description: {
            label: '敘述',
            type: Text,
            isMultiline: true,
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled',
            defaultValue: 'draft',
            access: {
                create: allowRoles(admin, moderator, editor),
                update: allowRoles(admin, moderator, editor),
            },
        },
        publishTime: {
            label: '發佈時間',
            type: NewDateTime,
            hasNowBtn: true,
            isReadOnly: false,
        },
        relatedPosts: {
            label: '相關文章',
            type: CustomRelationship,
            ref: 'Post',
            many: true,
        },
        isFeed: {
            label: '供稿',
            type: Checkbox,
            defaultValue: true,
        },
        thumbnail: {
            label: '縮圖網址',
            type: Url,
        },
        meta: {
            label: '中繼資料',
            type: Text,
            adminConfig: {
                isReadOnly: true,
            },
        },
        url: {
            label: '檔案網址',
            type: Url,
            adminConfig: {
                isReadOnly: true,
            },
        },
        duration: {
            label: '影片長度（秒）',
            type: Integer,
            adminConfig: {
                isReadOnly: true,
            },
        },
        // 新增欄位
        fileDuration_internal: {
            label: '影片檔案時長(ISO 8601)',
            type: Text,
            adminConfig: { isReadOnly: true, isHidden: true },
        },
        youtubeDuration_internal: {
            label: 'YouTube影片時長(ISO 8601)',
            type: Text,
            adminConfig: { isReadOnly: true, isHidden: true },
        },
    },

    extendGraphQLSchema: {
        types: [
            `
            extend type Video {
                fileDuration: String
                youtubeDuration: String
            }
            `,
        ],
        resolvers: {
            Video: {
                fileDuration: (item) => {
                    const v = item.fileDuration_internal
                    if (item.youtubeUrl && !item.file) return 'PT0S'
                    return v && v !== '0' ? v : 'PT0S'
                },
                youtubeDuration: (item) => {
                    const v = item.youtubeDuration_internal
                    if (item.file && !item.youtubeUrl) return 'PT0S'
                    return v && v !== '0' ? v : 'PT0S'
                },
            },
        },
    },

    plugins: [
        atTracking({
            hasNowBtn: false,
            isReadOnly: true,
        }),
        byTracking(),
    ],
    access: {
        update: allowRoles(admin, moderator, editor, owner),
        create: allowRoles(admin, moderator, editor, contributor, bot),
        delete: allowRoles(admin, moderator),
    },
    adminConfig: {
        defaultColumns: 'name, video, tags, state, publishTime, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        validateInput: async ({
            existingItem,
            resolvedData,
            addValidationError,
            context,
            operation,
        }) => {
            if (operation == 'update' && existingItem.state == 'published') {
                if (context.req.user.role == 'contributor') {
                    addValidationError("You don't have the permission")
                    return
                }
            }
            const keyToUse = validateWhichKeyShouldCMSChoose(
                existingItem,
                resolvedData,
                addValidationError,
                fileAdapter
            )
            if (!keyToUse) return

            switch (keyToUse) {
                case 'youtubeUrl':
                    // video is from youtube
                    resolvedData.url = resolvedData.youtubeUrl

                    deleteOldVideoFileInGCSIfNeeded(
                        existingItem,
                        resolvedData,
                        fileAdapter
                    )
                    break

                case 'file':
                    // video is from file

                    // if it has prev data,
                    // no matter what, clear youtubeUrl
                    if (existingItem) {
                        resolvedData.youtubeUrl = ''
                    }

                    await feedNewVideoData(resolvedData)

                    deleteOldVideoFileInGCSIfNeeded(
                        existingItem,
                        resolvedData,
                        fileAdapter
                    )
                    break
                case 'no-need-to-update':
                    break

                default:
                    break
            }
        },
        resolveInput: async ({ resolvedData, existingItem }) => {
            try {
                // 抓 YouTube URL 影片長度
                if (
                    resolvedData.youtubeUrl &&
                    resolvedData.youtubeUrl !== existingItem?.youtubeUrl
                ) {
                    const durationData = await getYouTubeDuration(
                        resolvedData.youtubeUrl
                    )
                    if (durationData) {
                        const { durationISO, durationSeconds } = durationData

                        // 設定 YouTube 相關欄位
                        resolvedData.youtubeDuration_internal = durationISO
                        resolvedData.duration = durationSeconds

                        // YouTube → File 時長設為 0
                        resolvedData.fileDuration_internal = 'PT0S'

                        if (existingItem?.meta) {
                            resolvedData.meta = ''
                        }

                        console.log(
                            `[Video Hook] YouTube URL processed: ${resolvedData.youtubeUrl}`
                        )
                        console.log(
                            `Duration (seconds): ${durationSeconds}, ISO: ${durationISO}`
                        )
                    } else {
                        // 如果抓不到，設定為 PT0S
                        resolvedData.youtubeDuration_internal = 'PT0S'
                        resolvedData.fileDuration_internal = 'PT0S'
                        resolvedData.duration = 0

                        if (existingItem?.meta) {
                            resolvedData.meta = ''
                        }

                        console.warn(
                            `[Video Hook] YouTube URL duration not found: ${resolvedData.youtubeUrl}`
                        )
                    }
                }

                // 更新 updatedAt_utc
                if (existingItem) {
                    resolvedData.updatedAt_utc = new Date()
                    console.log(
                        `[Video Hook] updatedAt_utc updated: ${resolvedData.updatedAt_utc}`
                    )
                }

                return resolvedData
            } catch (error) {
                console.error('[Video Hook] resolveInput error:', error)

                if (existingItem) {
                    resolvedData.updatedAt_utc = new Date()
                }
                return resolvedData
            }
        },

        beforeChange: async ({ resolvedData, context, operation, item }) => {
            console.log('=== beforeChange triggered ===')
            console.log('operation:', operation)

            // 跳過已處理過的更新（避免循環）
            if (context.req?._skipVideoHook) {
                console.log('>>> Skipping video hook (already processed)')
                return resolvedData
            }

            let newFile = null
            if (resolvedData.file && typeof resolvedData.file === 'object') {
                // 新上傳檔案(e.g. create)
                newFile = {
                    filename: resolvedData.file.filename,
                    url: resolvedData.file._meta?.url,
                    duration: resolvedData.file._meta?.duration ?? 0,
                    originalFile: resolvedData.file,
                }
            } else if (resolvedData.meta?.url) {
                // Keystone 只傳 meta.url(e.g. update)
                const filename = path.basename(
                    resolvedData.meta.url.replace('file://', '')
                )
                newFile = {
                    filename,
                    url: resolvedData.meta.url,
                    duration: resolvedData.duration ?? 0,
                    originalFile: null,
                }
            }

            // 如果有新檔案，立即處理並更新 resolvedData
            if (newFile) {
                console.log('>>> New file detected, processing immediately')

                try {
                    // 需要有 item.id 才能加入 queue（create 時可能還沒有）
                    const videoId = item?.id || 'temp-' + Date.now()

                    const job = await videoQueue.add('videoJob', {
                        videoId: videoId.toString(),
                        file: newFile.originalFile || {
                            filename: newFile.filename,
                            _meta: {
                                url: newFile.url,
                                duration: newFile.duration,
                                mimeInfo: { contentType: 'video/mp4' },
                            },
                        },
                        action: 'process',
                    })
                    console.log('[Hook] Process job added:', job.id)

                    if (videoQueueEvents) {
                        const result = await job.waitUntilFinished(
                            videoQueueEvents
                        )

                        // 直接更新 resolvedData，自動寫入 DB
                        resolvedData.fileDuration_internal = result.isoDuration
                        resolvedData.youtubeDuration_internal = 'PT0S'
                        resolvedData.duration = result.durationSec ?? 0

                        console.log(
                            '[Hook] Video data updated in resolvedData:',
                            {
                                videoId: result.videoId,
                                fileDuration: result.isoDuration,
                                duration: result.durationSec,
                            }
                        )
                    }
                } catch (err) {
                    console.error('[Hook] Failed to process new file:', err)
                }
            }

            console.log('==============================')
            return resolvedData
        },

        afterChange: async ({
            existingItem,
            updatedItem,
            context,
            operation,
        }) => {
            // 跳過 hook 觸發的更新
            if (context.req?._skipVideoHook) return

            const oldFile = existingItem?.file?.filename
            const currentFile = updatedItem?.file?.filename
            const hasYouTubeUrl = updatedItem?.youtubeUrl // 檢查是否有 YouTube URL

            // 只處理刪除檔案的情況
            if (oldFile && !currentFile && !hasYouTubeUrl) {
                console.log('[Hook] File deleted, cleaning up')

                try {
                    const job = await videoQueue.add('videoJob', {
                        videoId: updatedItem.id.toString(),
                        action: 'delete',
                    })

                    if (videoQueueEvents) {
                        await job.waitUntilFinished(videoQueueEvents)

                        const sudoContext = context.sudo()
                        sudoContext.req = {
                            ...(context.req || {}),
                            _skipVideoHook: true,
                        }

                        await sudoContext.executeGraphQL({
                            query: `
                                mutation ClearVideo($id: ID!) {
                                    updateVideo(
                                        id: $id,
                                        data: {
                                            fileDuration_internal: "PT0S",
                                            youtubeDuration_internal: "PT0S",
                                            duration: 0
                                        }
                                    ) { id }
                                }
                            `,
                            variables: { id: updatedItem.id },
                        })
                    }
                } catch (err) {
                    console.error('[Hook] Delete failed:', err)
                }
            }

            // 觸發 video JSON 更新
            const liveVideoNames = ['mnews-live', 'live-cam']
            const isLiveVideo = liveVideoNames.includes(updatedItem.name)
            if (isLiveVideo) {
                const wasPublished = existingItem?.state === 'published'
                const isPublished = updatedItem.state === 'published'

                // 只要跟 published 有關就觸發（發佈或下架）
                if (wasPublished || isPublished) {
                    console.log(
                        `[Hook] Live video "${updatedItem.name}" published status changed, triggering JSON regeneration`
                    )

                    try {
                        const fetch = require('node-fetch')
                        const CRON_SERVICE_URL =
                            cronService.apiUrlBase || 'http://localhost:5000'

                        const response = await fetch(
                            `${CRON_SERVICE_URL}/homepage_video`,
                            {
                                method: 'GET',
                            }
                        )

                        if (response.ok) {
                            console.log(
                                '[Hook] Video JSON updated successfully'
                            )
                        } else {
                            console.error(
                                '[Hook] Video JSON update failed:',
                                response.status,
                                response.statusText
                            )
                        }
                    } catch (error) {
                        console.error(
                            '[Hook] Failed to trigger video JSON update:',
                            error.message
                        )
                    }
                }
            }
        },
        afterDelete: async ({ existingItem, resolvedData }) => {
            deleteOldVideoFileInGCSIfNeeded(
                existingItem,
                resolvedData,
                fileAdapter
            )
        },
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
