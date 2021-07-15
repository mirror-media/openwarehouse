const {
    Checkbox,
    Integer,
    Relationship,
    Slug,
    Text,
} = require('@keystonejs/fields')
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
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
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
        isFeatured: {
            label: '置頂',
            type: Checkbox,
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
    hooks: {},
    adminConfig: {
        defaultColumns: 'slug, title, isFeatured, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
