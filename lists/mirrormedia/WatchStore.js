const { Slug, Text, Relationship, Url, Integer } = require('@keystonejs/fields')
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
            label: '店名',
            type: Text,
            isRequired: true,
        },
        address: {
            label: '地址',
            type: Text,
        },
        phone: {
            label: '電話',
            type: Text,
        },
        mapUrl: {
            label: '地圖網址',
            type: Url,
        },
        watches: {
            label: '手錶',
            type: Relationship,
            ref: 'Watch.stores',
            many: true,
        },
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
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
        defaultColumns:
            'slug, name, address, phone, watches, sortOrder, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
}
