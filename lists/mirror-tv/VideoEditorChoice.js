const { Text, Select, Relationship, Decimal } = require('@keystonejs/fields')

const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    bot,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')
const {
    getAccessControlViaServerType,
} = require('../../helpers/ListAccessHandler')

module.exports = {
    fields: {
        order: {
            label: '排序順位',
            type: Decimal,
        },
        videoEditor: {
            label: '精選影音',
            type: Relationship,
            ref: 'Post',
            many: false,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled',
            defaultValue: 'draft',
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
        read: getAccessControlViaServerType(
            admin,
            bot,
            moderator,
            editor,
            owner
        ),
        update: allowRoles(admin, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    hooks: {},
    adminConfig: {
        defaultColumns: 'order, videoEditor, state',
        defaultSort: '-updatedAt',
    },
    labelField: 'id',
    cacheHint: cacheHint,
}
