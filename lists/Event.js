const { Slug, Text, DateTime, Select, Relationship, Url, Checkbox } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const access = require('../helpers/access');

module.exports = {
    fields: {
        name: {
            label: '名稱',
            type: Text,
            isRequired: true,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, scheduled, published',
            defaultValue: 'draft'
        },
        publishTime: {
            label: '發佈時間',
            type: DateTime,
            format: 'MM/dd/yyyy HH:mm',
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
        sections: {
            label: '分區',
            type: Relationship,
            ref: 'Section',
            many: true
        },
        eventType: {
            label: '活動類型',
            type: Select,
            options: 'embedded, video, image, logo, mod'
        },
        startTime: {
            label: '開始時間',
            type: DateTime,
            format: 'MM/dd/yyyy HH:mm',
            defaultValue: new Date().toISOString(),
            isRequired: true,
            yearPickerType: 'select' // this option seems not work
        },
        endTime: {
            label: '結束時間',
            type: DateTime,
            format: 'MM/dd/yyyy HH:mm',
        },
        video: {
            label: '影片',
            type: Relationship,
            ref: 'Video',
            /*dependsOn: {
                'eventType': 'video'
            }*/
        },
        image: {
            label: '圖片',
            type: Relationship,
            ref: 'Image',
            /*dependsOn: {
                '$or': [
                    { 'eventType': 'image' },
                    { 'eventType': 'logo' }
                ]
            }*/
        },
        embedCode: {
            label: 'Embed Code',
            type: Text,
            isMultiline: true,
            /*dependsOn: {
                '$or': [
                    { 'eventType': 'embedded' },
                    { 'eventType': 'mod' }
                ]
            }*/
        },
        link: {
            label: '連結',
            type: Url,
            /*dependsOn: {
                'eventType': 'logo'
            }*/
        },
        isFeatured: {
            label: '置頂',
            type: Checkbox
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: access.userIsAdminOrModerator,
        create: access.userIsAdminOrModerator,
        delete: access.userIsAdmin,
    },
    adminConfig: {
        defaultColumns: 'name, eventType, state, startTime, endTime',
        defaultSort: '-startTime',
    },
}