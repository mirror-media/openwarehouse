const { Integer, Select, Relationship} = require('@keystonejs/fields')
//const CustomRelationship = require('../../fields/CustomRelationship')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    bot,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')
const {
    getAccessControlViaServerType,
} = require('../../helpers/ListAccessHandler')
const NewDateTime = require('../../fields/NewDateTime/index.js')
module.exports = {
    fields: {
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
        adPost: {
            label: '廣編文章',
            type: Relationship,
            ref: 'Post',
            many: false,
        },
        satus: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived',
            defaultValue: 'draft',
        },
        startTime:{
			label: '起始日期',
			type: NewDateTime,
			hasNowBtn: true,
			isReadOnly: false,
		},
        endTime:{
			label: '結束日期',
			type: NewDateTime,
			hasNowBtn: true,
			isReadOnly: false,
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
        read: getAccessControlViaServerType(
            admin,
            bot,
            moderator,
            editor,
            contributor,
            owner
        ),
        update: allowRoles(admin, moderator, editor, bot),
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin, moderator),
    },
    hooks: {},
    adminConfig: {
        defaultColumns: 'adPost, satus, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}
