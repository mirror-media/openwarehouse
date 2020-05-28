const { Text, Checkbox, Select, Relationship, DateTime } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const access = require('../helpers/access');

module.exports = {
    fields: {
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
        /*video: {
            type: Types.GcsFile,
            initial: true,
            autoCleanup: true,
            datePrefix: 'YYYYMMDDHHmmss',
            bucket: bucket,
            destination: 'assets/videos/',
            publicRead: true,
        },*/
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
    labelField: 'title'
}
