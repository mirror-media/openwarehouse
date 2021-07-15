const {
    Integer,
    Text,
    Relationship,
    Url,
    Select,
} = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { admin, moderator, allowRoles } = require('../../helpers/access/readr')
const cacheHint = require('../../helpers/cacheHint')
const NewDateTime = require('../../fields/NewDateTime/index.js')

module.exports = {
    fields: {
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        description: {
            label: '描述',
            type: Text,
        },
        requireTime: {
            label: '需要時間',
            type: Integer,
        },
        heroImage: {
            label: '首圖',
            type: Relationship,
            ref: 'Image',
        },
        startTime: {
            label: '開始時間',
            type: NewDateTime,
        },
        endTime: {
            label: '結束時間',
            type: NewDateTime,
        },
        progress: {
            label: '完成進度',
            type: Integer,
        },
        collabLink: {
            label: '協作連結',
            type: Url,
        },
        achvLink: {
            label: '結案成果連結',
            type: Url,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived',
            defaultValue: 'draft',
        },
        publishTime: {
            label: '發佈時間',
            type: NewDateTime,
            hasNowBtn: true,
            isReadOnly: false,
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
        update: allowRoles(admin, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'name, description, progress, state, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}
