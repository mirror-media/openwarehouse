const { Slug, Text, Relationship, Select, Url } = require('@keystonejs/fields')
const NewDateTime = require('../../fields/NewDateTime/index.js')

const HTML = require('../../fields/HTML')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')

module.exports = {
    fields: {
        slug: {
            label: 'Slug',
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        partner: {
            label: '合作單位',
            type: Relationship,
            ref: 'Partner',
        },
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
            defaultValue: 'untitled',
        },
        subtitle: {
            label: '副標',
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
        byline: {
            label: '作者',
            type: Text,
        },
        thumbnail: {
            label: '縮圖',
            type: Url,
        },
        brief: {
            label: '前言',
            type: HTML,
            isMultiline: true,
        },
        content: {
            label: '內文',
            // type: Text,
            type: HTML,
            isMultiline: true,
        },
        source: {
            label: '原文網址',
            type: Url,
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
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    hooks: {},
    adminConfig: {
        defaultColumns: 'title, slug, state, createdBy, publishTime',
        defaultSort: '-publishTime',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
