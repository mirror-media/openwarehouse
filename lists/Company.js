const { Text, Url, Relationship } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const access = require('../helpers/access');

module.exports = {
    fields: {
        name: {
            label: '公司',
            type: Text,
            isRequired: true
        },
        website: {
            label: 'Ｗebsite',
            type: Url
        },
        github: {
            label: 'GitHub',
            type: Text
        },
        twitter: {
            label: 'Twitter',
            type: Text
        },
        users: {
            label: '員工',
            type: Relationship,
            ref: 'User.company',
            many: true
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        read: access.userIsAdminOrModerator,
        update: access.userIsAdminOrModerator,
        create: access.userIsAdminOrModerator,
        delete: access.userIsAdminOrModerator,
        auth: true,
    },
    adminConfig: {
        defaultColumns: 'name, website, github, twitter, createdAt',
        defaultSort: '-createdAt'
    },
}