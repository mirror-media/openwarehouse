const { Text, Url, Relationship } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/mirrormedia')

module.exports = {
    fields: {
        name: {
            label: '公司',
            type: Text,
            isRequired: true,
        },
        website: {
            label: 'Ｗebsite',
            type: Url,
        },
        github: {
            label: 'GitHub',
            type: Text,
        },
        twitter: {
            label: 'Twitter',
            type: Text,
        },
        users: {
            label: '員工',
            type: Relationship,
            ref: 'User.company',
            many: true,
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
        read: allowRoles(admin, moderator, editor),
        update: allowRoles(admin, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
        auth: true,
    },
    adminConfig: {
        defaultColumns: 'name, website, github, twitter, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
}
