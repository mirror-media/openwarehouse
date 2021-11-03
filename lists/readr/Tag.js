const { Slug, Text, Relationship, Select } = require('@keystonejs/fields')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/readr')
const cacheHint = require('../../helpers/cacheHint')

module.exports = {
    fields: {
        slug: {
            label: 'Slug',
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        name: {
            label: '名稱',
            type: Text,
            isRequired: true,
            isUnique: true,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'inactive, active, archived',
            defaultValue: 'inactive',
        },
        ogTitle: {
            label: 'FB 分享標題',
            type: Text,
        },
        ogDescription: {
            label: 'FB 分享說明',
            type: Text,
        },
        ogImage: {
            label: 'FB 分享縮圖',
            type: Relationship,
            ref: 'Image',
        },
        relatedPost: {
            label: 'Related Post',
            type: Relationship,
            ref: 'Post.tags',
            many: true,
        },
    },
    plugins: [atTracking(), byTracking()],
    access: {
        update: allowRoles(admin, moderator, editor),
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'slug, name, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}
