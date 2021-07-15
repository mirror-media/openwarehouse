const { Text, Relationship, File, Url } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { GCSAdapter } = require('../../lib/GCSAdapter')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/readr')
const cacheHint = require('../../helpers/cacheHint')

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
            hooks: {
                beforeChange: async ({ existingItem }) => {
                    if (existingItem && existingItem.file) {
                        await fileAdapter.delete(
                            existingItem.file.id,
                            existingItem.file.originalFilename
                        )
                    }
                },
            },
        },
        coverPhoto: {
            label: '封面照片',
            type: Relationship,
            ref: 'Image',
        },
        description: {
            label: '描述',
            type: Text,
            isMultiline: true,
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true,
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
        defaultColumns: 'name, tags, state, publishTime, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        resolveInput: ({
            operation,
            existingItem,
            resolvedData,
            originalInput,
        }) => {
            if (resolvedData.file) {
                resolvedData.meta = resolvedData.file._meta
                resolvedData.url = resolvedData.file._meta.url
                resolvedData.duration = resolvedData.file._meta.duration
            }
            return resolvedData
        },
        afterDelete: async ({ existingItem }) => {
            if (existingItem.file) {
                await fileAdapter.delete(
                    existingItem.file.id,
                    existingItem.file.originalFilename
                )
            }
        },
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
