const { Integer, Select, Relationship } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const {
    admin,
    moderator,
    allowRoles,
} = require('../../helpers/access/mirrormedia')

const {
    validateIfPostIsPublished,
} = require('../../utils/validateIfPostIsPublished')

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
        update: allowRoles(admin, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    hooks: {
        validateInput: async ({
            existingItem,
            resolvedData,
            addValidationError,
        }) => {
            // await validateIfPostIsPublished(
            //     resolvedData,
            //     existingItem,
            //     addValidationError
            // )
        },
    },
    adminConfig: {
        defaultColumns: 'choice, state, createdAt',
        defaultSort: '-createdAt',
    },
}
