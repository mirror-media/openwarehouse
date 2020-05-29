const { Slug, Text, Url, Checkbox } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const access = require('../helpers/access');

module.exports = {
    fields: {
        slug: {
            label: 'Slug',
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        display: {
            label: '中文名稱',
            type: Text,
            isRequired: true
        },
        website: {
            label: 'Website',
            tybel: '網址',
            type: Url
        },
        isPublic: {
            label: '公開',
            type: Checkbox
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: access.userIsAdminOrModeratorOrOwner,
        create: access.userIsAboveAuthor,
        delete: access.userIsAdminOrModeratorOrOwner,
    },
    adminConfig: {
        defaultColumns: 'slug, display, website, isPublic, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'display',
}