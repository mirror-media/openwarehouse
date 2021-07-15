const {
    Text,
    Checkbox,
    Select,
    Relationship,
    File,
    Url,
} = require('@keystonejs/fields')
const NewDateTime = require('../../fields/NewDateTime/index.js')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { GCSAdapter } = require('../../lib/GCSAdapter')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/mirrormedia')

const {
    deleteOldVideoFileInGCS,
    feedNewVideoData,
    validateWhichUrlShouldCMSChoose,
    assignYoutubeUrl,
} = require('../../utils/videoHandler')
const gcsDir = 'assets/videos/'
const fileAdapter = new GCSAdapter(gcsDir)

module.exports = {
    fields: {
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        file: {
            label: '檔案',
            type: File,
            adapter: fileAdapter,
            isRequired: true,
        },
        sections: {
            label: '分區',
            type: Relationship,
            ref: 'Section',
            many: true,
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
        },
        publishTime: {
            label: '發佈時間',
            type: NewDateTime,
            hasNowBtn: true,
            isReadOnly: false,
        },
        relatedPosts: {
            label: '相關文章',
            type: Relationship,
            ref: 'Post',
            many: true,
        },
        isFeed: {
            label: '供稿',
            type: Checkbox,
            defaultValue: true,
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
            type: Text,
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
        update: allowRoles(admin, moderator, editor),
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'name, video, tags, state, publishTime, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        resolveInput: async ({
            operation,
            existingItem,
            resolvedData,
            originalInput,
        }) => {
            const { file } = resolvedData

            if (typeof file === 'undefined') {
                // no update file,means now video is youtube
                // set url to youtubeUrl
                resolvedData.url = assignYoutubeUrl(existingItem, resolvedData)
            } else if (file === null) {
                //  selected file is set to cleared
                // need to remove file in gcs
                deleteOldVideoFileInGCS(existingItem, fileAdapter)
            } else {
                // update new file
                await feedNewVideoData(resolvedData)
                deleteOldVideoFileInGCS(existingItem, fileAdapter)
            }

            return resolvedData
        },
        validateInput: async ({
            existingItem,
            resolvedData,
            addValidationError,
        }) => {
            validateWhichUrlShouldCMSChoose(
                existingItem,
                resolvedData,
                addValidationError
            )
        },
        afterDelete: async ({ existingItem }) => {
            deleteOldVideoFileInGCS(existingItem, fileAdapter)
        },
    },
    labelField: 'name',
}
