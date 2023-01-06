const { Integer, Select, CalendarDay } = require('@keystonejs/fields')
const CustomRelationship = require('../../fields/CustomRelationship')
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
const addDate = (day) => {
    let today =  new Date()
    today.setDate(today.getDate() + day)
    return today.toISOString().slice(0, 10)
}
module.exports = {
    fields: {
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
        choice: {
            label: '精選文章',
            type: CustomRelationship,
            ref: 'Post',
        },
        publishedDate: {
            label: '上架日期（預設隔日）',
            type: CalendarDay,
            defaultValue: addDate(1)
        },
        expiredDate: {
            label: '下架日期（預設隔一日）',
            type: CalendarDay,
            defaultValue: addDate(2)
            //new Date().setDate(today.getDate() + 1).toISOString().slice(0, 10)
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived, invisible',
            defaultValue: 'draft',
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
        defaultColumns: 'choice, state, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}
