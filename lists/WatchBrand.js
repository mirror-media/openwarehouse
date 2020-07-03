const { Slug, Text, Relationship } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { uuid } = require('uuidv4');
const access = require('../helpers/access');

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
            }
        },
        name: {
            label: '品牌',
            type: Text,
            isRequired: true
        },
        watches: {
            label: '手錶',
            type: Relationship,
            ref: 'Watch.brand'
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: access.userIsNotContributor,
        create: access.userIsNotContributor,
        delete: access.userIsAdmin,
    },
    adminConfig: {
        defaultColumns: 'slug, name, watches, createdAt',
        defaultSort: '-createdAt',
    },
}