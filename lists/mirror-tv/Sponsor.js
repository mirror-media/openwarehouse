const { Integer, Text, Select, Relationship, Url } = require('@keystonejs/fields')

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
        title:{
            label: '標題',
            type: Text
        },
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published',
            defaultValue: 'draft',
            access: {
                // 如果user.role是contributor 那將不能發佈文章（draft以外的狀態）
                // 所以在此不給contributor有更動post.state的create/update權限
                // 但又因post.state的defaultValue是draft
                // 所以也就變相地達到contributor只能發佈draft的要求
                create: allowRoles(admin, moderator, editor),
                update: allowRoles(admin, moderator, editor),
            },
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
            label: '首圖(必填)',
            type: ImageRelationship,
            ref: 'Image',
            isRequired: true,
        },
        mobile: {
            label: '手機用圖',
            type: ImageRelationship,
            ref: 'Image',
            isRequired: true,
        },
        tablet : {
            label: '平板用圖',
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
