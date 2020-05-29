const { Text, Checkbox, Select, Relationship, File } = require('@keystonejs/fields');
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { GCSAdapter } = require('../lib/GCSAdapter');
const gcsDir = 'assets/videos/'


module.exports = {
    fields: {
        file: {
            type: File,
            adapter: new GCSAdapter(gcsDir),
            isRequired: true,
        },
        title: {
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
            ref: 'PostCategory',
            many: true
        },
        video:{
            type:Relationship, ref:'GCSFile', many:false
        },

        tags: {
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
        publishedDate: {
            label: '發佈日期',
            type: DateTimeUtc,
            defaultValue: new Date(),
            dependsOn: {
                '$or': {
                    state: [
                        'published',
                        'scheduled'
                    ]
                }
            }
        },
        relateds: {
            label: '相關文章',
            type: Relationship,
            ref: 'Post',
            many: true
        },
        createTime: {
            type: DateTimeUtc,
            defaultValue: new Date()
        },
        feed: {
            label: '供稿',
            type: Checkbox,
            defaultValue: true
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    adminConfig: {
        defaultColumns: 'title, video, tags',
        defaultSort: '-createTime',
    },
    // hooks:{
        // Hooks for create and update operations
        // resolveInput: async (...) => {...}
        // validateInput: async (...) => {...}
        // beforeChange: async (...) => {...}
        // afterChange: async (...) => {...}

        // Hooks for delete operations
        // validateDelete: async (...) => {...}
        // beforeDelete: async (...) => {...}
        // afterDelete: async (...) => {...}
    // }
}
