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
            label: '品牌',
            type: Text,
            isRequired: true,
        },
        watches: {
            label: '手錶',
            type: Relationship,
            ref: 'Watch.brand',
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
        defaultColumns: 'slug, name, watches, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
}
