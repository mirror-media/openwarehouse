const { Integer, Text, Select, Relationship } = require('@keystonejs/fields')
const CustomRelationship = require('../../fields/CustomRelationship')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
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
        featuredPost: {
            label: '特色專題',
            type: Relationship,
            ref: 'Post',
            isRequired: true,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived, invisible',
            defaultValue: 'draft',
        },
        publishTime: {
            label: '發布時間',
            type: NewDateTime,
            hasNowBtn: true,
            isReadOnly: false,
        },
        description: {
            label: '描述',
            type: Text,
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
        defaultColumns: 'publishTime, featuredPost, description, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'sortOrder',
    cacheHint: cacheHint,
}
