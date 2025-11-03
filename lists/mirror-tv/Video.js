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
const { processVideoInBackground } = require('../../utils/processVideoInBackground')

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
            `
        ],
        resolvers: {
            Video: {
                fileDuration: (item) => {
                    const v = item.fileDuration_internal;
                    if (item.youtubeUrl && !item.file) return 'PT0S';
                    return v && v !== '0' ? v : 'PT0S';
                },
                youtubeDuration: (item) => {
                    const v = item.youtubeDuration_internal;
                    if (item.file && !item.youtubeUrl) return 'PT0S';
                    return v && v !== '0' ? v : 'PT0S';
                }
            }
        }
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
                if (resolvedData.youtubeUrl && resolvedData.youtubeUrl !== existingItem?.youtubeUrl) {
                    const durationData = await getYouTubeDuration(resolvedData.youtubeUrl);
                    if (durationData) {
                        const { durationISO, durationSeconds } = durationData;

                        // 設定 YouTube 相關欄位
                        resolvedData.youtubeDuration_internal = durationISO;
                        resolvedData.duration = durationSeconds;

                        // YouTube → File 時長設為 0
                        resolvedData.fileDuration_internal = 'PT0S';

                        console.log(`[Video Hook] YouTube URL processed: ${resolvedData.youtubeUrl}`);
                        console.log(`Duration (seconds): ${durationSeconds}, ISO: ${durationISO}`);
                    } else {
                        // 如果抓不到，設定為 PT0S
                        resolvedData.youtubeDuration_internal = 'PT0S';
                        resolvedData.fileDuration_internal = 'PT0S';
                        resolvedData.duration = 0;

                        console.warn(`[Video Hook] YouTube URL duration not found: ${resolvedData.youtubeUrl}`);
                    }
                }

                // 更新 updatedAt_utc
                if (existingItem) { 
                    resolvedData.updatedAt_utc = new Date();
                    console.log(`[Video Hook] updatedAt_utc updated: ${resolvedData.updatedAt_utc}`);
                }

                return resolvedData;
            } catch (error) {
                console.error('[Video Hook] resolveInput error:', error);

                if (existingItem) {
                    resolvedData.updatedAt_utc = new Date();
                }
                return resolvedData;
            }
        },

        afterChange: async ({ existingItem, updatedItem, context, operation }) => {
            const oldFile = existingItem?.file?.filename;
            const newFile = updatedItem?.file?.filename;

            console.log('[Hook] afterChange triggered, operation:', operation);
            console.log('Old File:', oldFile, 'New File:', newFile);

            // 檔案沒變 → 跳過
            if (oldFile && newFile && oldFile === newFile){
                console.log('File name same, skip processing');
                return;
            }

            // 更換檔案
            if (oldFile && !newFile && updatedItem.file) {
                console.log('Replacing file and wait for next afterChange');
                return;
            }

            // 檔案被刪除
            if (oldFile && !newFile && !updatedItem.file) {
                console.log('File removed, clearing duration');
                processVideoInBackground({
                    videoId: updatedItem.id.toString(),
                    fileInfo: null,
                    action: 'delete',
                }, context);
                return;
            }

            // 新檔案 → 背景處理影片
            console.log('New file detected, processing:', newFile);
            processVideoInBackground({
                videoId: updatedItem.id.toString(),
                fileInfo: updatedItem.file,
                action: 'process', // Run ffmpeg 計算 duration
            }, context);
        },

        beforeChange: async ({
            existingItem,
            resolvedData,
            addValidationError,
        }) => {
            // validateWhichKeyShouldCMSChoose(
            //     existingItem,
            //     resolvedData,
            //     addValidationError
            // )
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
