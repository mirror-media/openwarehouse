const { Integer, Select, Relationship } = require('@keystonejs/fields')
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
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
        choice: {
            label: '精選文章',
            type: Relationship,
            ref: 'Post',
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived, invisible',
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
        update: allowRoles(admin, bot, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    hooks: {},
    adminConfig: {
        defaultColumns: 'choice, state, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}
