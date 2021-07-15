const {
    Relationship,
    Slug,
    Text,
    Url,
    Checkbox,
    Integer,
} = require('@keystonejs/fields')
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
const ImageRelationship = require('../../fields/ImageRelationship')

const cacheHint = require('../../helpers/cacheHint')

module.exports = {
    fields: {
        slug: {
            label: 'Slug',
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        name: {
            label: '節目名稱',
            type: Text,
            isRequired: true,
        },
        show: {
            label: '相關節目',
            type: Relationship,
            ref: 'Show.sections',
            many: true,
        },
        series: {
            label: '相關單元',
            type: Relationship,
            ref: 'Serie.section',
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
        update: allowRoles(admin, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    hooks: {
        beforeChange: async ({ existingItem, resolvedData }) => {},
    },
    adminConfig: {
        // defaultColumns: 'schedule, time, updatedAt',
        // defaultSort: '-updatedAt',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
