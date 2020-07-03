const { Text, Relationship, File } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { GCSAdapter } = require('../lib/GCSAdapter');
const access = require('../helpers/access');
const gcsDir = 'assets/audios/'

module.exports = {
    fields: {
        title: {
            label: '標題',
            type: Text,
            isRequired: true
        },
        file: {
            type: File,
            adapter: new GCSAdapter(gcsDir),
            isRequired: true,
        },
        coverPhoto: {
            label: '封面照片',
            type: Relationship,
            ref: 'Image'
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true
        },
        meta: {
            label: '中繼資料',
            type: Text,
            access: {
                create: false,
                update: false,
            }
        },
        url: {
            label: '檔案網址',
            type: Text,
            access: {
                create: false,
                update: false,
            }
        },
        duration: {
            label: '音檔長度（秒）',
            type: Number,
            access: {
                create: false,
                update: false,
            }
        }
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: access.userIsNotContributor,
        create: access.userIsNotContributor,
        delete: access.userIsAdmin,
    },
    adminConfig: {
        defaultColumns: 'title, audio, tags, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        resolveInput: ({ operation, existingItem, resolvedData, originalInput }) => {
            if (resolvedData.file) {
                resolvedData.meta = resolvedData.file._meta
                resolvedData.url = resolvedData.file._meta.url
                resolvedData.duration = resolvedData.file._meta.duration
            }
            return resolvedData
        },
    },
    plural: 'Audios',
    labelField: 'title'
}
