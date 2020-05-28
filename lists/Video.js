const { Text, Checkbox, Select, Relationship } = require('@keystonejs/fields');
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');

module.exports = {
    fields: {
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
        //coverPhoto: { label: '首圖', type: Types.ImageRelationship, ref: 'Image' },
        //description: { type: Types.Html, wysiwyg: true, height: 150 },
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
}
