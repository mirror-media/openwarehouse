const { Slug, Text, Relationship } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { uuid } = require('uuidv4')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/mirrormedia')

module.exports = {
    fields: {
        slug: {
            label: 'Slug',
            type: Slug,
            generate: uuid,
            makeUnique: uuid,
            isUnique: true,
            regenerateOnUpdate: false,
            access: {
                create: false,
                update: false,
            },
        },
        name: {
            label: '名稱',
            type: Text,
            isRequired: true,
            isUnique: true,
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
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'slug, name, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
}
