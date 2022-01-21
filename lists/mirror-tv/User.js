const { Text, Checkbox, Password, Select } = require('@keystonejs/fields')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    moderator,
    owner,
    allowRoles,
} = require('../../helpers/access/mirror-tv')

function isSetAccountNotProtected(resolvedData) {
    if (resolvedData && resolvedData.isProtected === false) {
        return true
    } else {
        return false
    }
}

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
            options: 'admin, bot, contributor, editor, moderator',
            defaultValue: 'contributor',
            isRequired: true,
            access: {
                update: allowRoles(admin),
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
    ],
    access: {
        read: allowRoles(admin, moderator, owner),
        update: allowRoles(admin, owner),
        create: allowRoles(admin),
        delete: allowRoles(admin),
    },
    hooks: {
        validateInput: async ({
            operation,
            existingItem,
            resolvedData,
            addValidationError,
        }) => {
            if (
                operation === 'update' &&
                existingItem.isProtected &&
                !isSetAccountNotProtected(resolvedData)
            ) {
                const protectedFields = ['name', 'email', 'role']
                const changedFields = []
                protectedFields.forEach((field) => {
                    if (
                        resolvedData[field] &&
                        resolvedData[field] !== existingItem[field]
                    ) {
                        changedFields.push(field)
                    }
                })

                addValidationError(
                    `此帳號已啟動「受保護」，${changedFields.join(
                        '、'
                    )}欄位不能被更動。如需更動，需先取消選取「受保護」再執行。`
                )
            }
        },
    },
    adminConfig: {
        defaultColumns: 'name, email, role, isAdmin, company, createdAt',
        defaultSort: '-createdAt',
    },
}
