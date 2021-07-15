const { Integer, Text, Select, Relationship } = require('@keystonejs/fields')
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
        writer: {
            label: '作者',
            type: Relationship,
            ref: 'Author',
        },
        byline: {
            label: '引自',
            type: Text,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived, invisible',
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
        defaultColumns: 'name, writer, byline, state, publishedTime, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}
