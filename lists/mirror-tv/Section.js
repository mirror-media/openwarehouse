const { Relationship, Slug, Text, Select } = require('@keystonejs/fields')

const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    moderator,
    editor,
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
            label: '索引名稱',
            type: Text,
            isRequired: true,
        },
        host:{
            label: '主持人',
            type: Relationship,
            ref: 'Contact',
            many: true,

        },
        artshow:{
            label: '相關正片',
            type: Relationship,
            ref: 'ArtShow',
            many: true,
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
        introduction:{
            label: '文字簡介',
            type: Text,
            isMultiline:true,
        },
        style:{
            label: '樣式',
            type: Select,
            options: [
                {value:'default', label:'預設'},
                {value: 'art', label: '藝文'},
            ],
            defaultValue: 'default',
        },
        trailerUrl:{
            label: '預告清單(url)',
            type: Text,
        }
    },
    plugins: [
        atTracking({
            hasNowBtn: false,
            isReadOnly: true,
        }),
        byTracking(),
    ],
    access: {
        update: allowRoles(admin, moderator, editor),
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin, moderator),
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
