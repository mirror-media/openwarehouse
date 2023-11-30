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
} = require('../../utils/videoHandler')

module.exports = {
    fields: {
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
            access: {
                update: allowRoles(admin, moderator, editor),
            },
        },
        youtubeUrl: {
            label: 'Youtube網址',
            type: Text,
            access: {
                update: allowRoles(admin, moderator, editor),
            },
        },
        file: {
            label: '檔案',
            type: File,
            adapter: fileAdapter,
            access: {
                update: allowRoles(admin, moderator, editor, owner),
            },
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
            access: {
                update: allowRoles(admin, moderator, editor),
            },
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
            access: {
                update: allowRoles(admin, moderator, editor),
            },
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled',
            defaultValue: 'draft',
            access: {
                update: allowRoles(admin, moderator, editor, owner),
            },
        },
        publishTime: {
            label: '發佈時間',
            type: NewDateTime,
            hasNowBtn: true,
            isReadOnly: false,
            access: {
                update: allowRoles(admin, moderator, editor, owner),
            },
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
            access: {
                update: allowRoles(admin, moderator, editor),
            },
        },
        thumbnail: {
            label: '縮圖網址',
            type: Url,
            access: {
                update: allowRoles(admin, moderator, editor),
            },
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
        defaultColumns: 'title, video, tags, state, publishTime, createdAt',
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
