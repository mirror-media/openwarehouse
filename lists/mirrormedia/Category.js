const { Slug, Text, Checkbox, Relationship } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const {
    admin,
    moderator,
    allowRoles,
} = require('../../helpers/access/mirrormedia')

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
        isMemberOnly: {
            label: '會員專區',
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
    adminConfig: {
        defaultColumns: 'slug, name, isFeatured, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
}
