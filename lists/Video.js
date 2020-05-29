const { Text, Checkbox, Select, Relationship, File } = require('@keystonejs/fields');
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { GCSAdapter } = require('../lib/GCSAdapter');
const access = require('../helpers/access');
const gcsDir = 'assets/videos/'


module.exports = {
    fields: {
        file: {
            type: File,
            adapter: new GCSAdapter(gcsDir),
            isRequired: true,
        },
        title: {
            label: '標題',
            type: Text,
            isRequired: true
        },
        sections: {
            label: '分區',
            type: Relationship,
            ref: 'Section',
            many: true
        },
        categories: {
            label: '分類',
            type: Relationship,
            ref: 'Category',
            many: true
        },
        coverPhoto: {
            label: '封面照片',
            type: Relationship,
            ref: 'Image'
        },
        description: {
            label: '敘述',
            type: Text,
            isMultiline: true
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled',
            defaultValue: 'draft'
        },
        publishTime: {
            label: '發佈時間',
            type: DateTime,
            format: 'MM/DD/YYYY hh:mm A',
            defaultValue: new Date().toISOString(),
            /*dependsOn: {
                '$or': {
                    state: [
                        'published',
                        'scheduled'
                    ]
                }
            }*/
        },
        relatedPosts: {
            label: '相關文章',
            type: Relationship,
            ref: 'Post',
            many: true
        },
        isFeed: {
            label: '供稿',
            type: Checkbox,
            defaultValue: true
        },

        mimeInfo:{
            type: Text, access:{read:false, write:false}
        }
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: access.userIsAboveAuthorOrOwner,
        create: access.userIsNotContributor,
        delete: access.userIsAboveAuthorOrOwner,
    },
    adminConfig: {
        defaultColumns: 'title, video, tags, state, publishTime, createdAt',
        defaultSort: '-createdAt',
    },
    hooks:{
        // Hooks for create and update operations
        resolveInput: async ({ operation, existingItem, resolvedData, originalInput }) => {
            console.log("RESOLVED INPUT:", resolvedData)
            return resolvedData
        }
        // validateInput: async (...) => {...}
        // beforeChange: async (...) => {...}
        // afterChange: async (...) => {...}

        // Hooks for delete operations
        // validateDelete: async (...) => {...}
        // beforeDelete: async (...) => {...}
        // afterDelete: async (...) => {...}
    },
    labelField: 'title'
}
