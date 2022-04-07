const { Integer, Relationship, Url } = require('@keystonejs/fields')

const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    moderator,
    editor,

    contributor,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const ImageRelationship = require('../../fields/ImageRelationship')
const cacheHint = require('../../helpers/cacheHint')

module.exports = {
    fields: {
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
        topic: {
            label: '專題',
            type: Relationship,
            ref: 'Topic',
        },
        url: {
            label: '外部連結',
            type: Url,
        },
        logo: {
            label: '首圖',
            type: ImageRelationship,
            ref: 'Image',
            isRequired: true,
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
        update: allowRoles(admin, moderator, editor, contributor),
        create: allowRoles(admin, moderator, editor, contributor),
        delete: allowRoles(admin, moderator),
    },
    adminConfig: {
        defaultColumns: 'sortOrder, topic',
        defaultSort: '-sortOrder',
    },
    labelField: 'sortOrder',
    cacheHint: cacheHint,
}
