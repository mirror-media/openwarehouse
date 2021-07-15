const { Text, Url, Select, Integer } = require('@keystonejs/fields')
const { gql } = require('apollo-server-express')

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
        name: {
            label: '影片名稱',
            type: Text,
            isRequired: true,
        },
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
        ytUrl: {
            label: 'Youtube影片',
            type: Url,
            isRequired: true,
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
        update: allowRoles(admin, moderator, editor, contributor, owner),
        create: allowRoles(admin, moderator, editor, contributor, owner),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'name, sortOrder, state',
        defaultSort: '-sortOrder',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
