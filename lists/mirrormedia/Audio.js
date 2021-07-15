const { Text, Relationship, File, Integer } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { GCSAdapter } = require('../../lib/GCSAdapter')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/mirrormedia')
const gcsDir = 'assets/audios/'

const fileAdapter = new GCSAdapter(gcsDir)

module.exports = {
    fields: {
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        file: {
            type: File,
            adapter: fileAdapter,
            isRequired: true,
        },
        coverPhoto: {
            label: '封面照片',
            type: Relationship,
            ref: 'Image',
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
            type: Text,
            adminConfig: {
                isReadOnly: true,
            },
        },
        duration: {
            label: '音檔長度（秒）',
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
        update: allowRoles(admin, moderator, editor),
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'title, audio, tags, createdAt',
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
    plural: 'Audios',
    labelField: 'name',
}
