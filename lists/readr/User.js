const { Text, Checkbox, Password, Select } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const {
    admin,
    moderator,
    editor,
    owner,
    allowRoles,
} = require('../../helpers/access/readr')
const cacheHint = require('../../helpers/cacheHint')

module.exports = {
    fields: {
        name: {
            label: '姓名',
            type: Text,
            isRequired: true,
        },
        email: {
            label: 'Email',
            type: Text,
            isRequired: true,
            isUnique: true,
        },
        password: {
            label: '密碼',
            type: Password,
        },
        role: {
            label: '角色權限',
            type: Select,
            dataType: 'string',
            options: 'contributor, author, editor, moderator, admin',
            defaultValue: 'contributor',
            isRequired: true,
            access: {
                update: allowRoles(admin, moderator),
            },
        },
        isProtected: {
            label: '受保護',
            type: Checkbox,
            access: {
                update: allowRoles(admin),
            },
        },
    },
    plugins: [
        atTracking({
            hasNowBtn: false,
            isReadOnly: true,
        }),
        byTracking(),
    ], // access: {
    //     read: allowRoles(admin, moderator, editor, owner),
    //     update: allowRoles(admin, moderator, owner),
    //     create: allowRoles(admin, moderator),
    //     delete: allowRoles(admin),
    //     auth: true,
    // },
    hooks: {
        resolveInput: async ({ operation, existingItem, resolvedData }) => {
            if (operation === 'update' && existingItem.isProtected) {
                const protectedFields = ['name', 'email', 'role']
                protectedFields.forEach((field) => {
                    resolvedData[field] = existingItem[field]
                })
            }
            return resolvedData
        },
    },
    adminConfig: {
        defaultColumns: 'name, email, role, isProtected, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}
