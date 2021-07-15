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
const HTML = require('../../fields/HTML')
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
        heroImage: {
            label: '首圖',
            // type: Relationship,
            type: ImageRelationship,
            ref: 'Image',
            // isRequired: true,
        },
        heroVideo: {
            label: '影片',
            type: Relationship,
            ref: 'Video',
            // isRequired: true,
        },
        content: {
            label: '內文',
            type: HTML,
            // type: Text,
        },
        author: {
            label: '導演',
            type: Relationship,
            ref: 'Contact',
        },
        series: {
            label: '相關單元',
            type: Relationship,
            ref: 'Serie.post',
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
