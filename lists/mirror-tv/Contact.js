const {
    Slug,
    Text,
    Url,
    Relationship,
    Checkbox,
} = require('@keystonejs/fields')
const { Markdown } = require('@keystonejs/fields-markdown')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const { uuid } = require('uuidv4')
const {
    admin,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')

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
            },
        },
        name: {
            label: '姓名',
            type: Text,
            isRequired: true,
        },
        email: {
            label: 'Email',
            type: Text,
        },
        image: {
            label: '圖片',
            type: Relationship,
            ref: 'Image',
        },
        homepage: {
            label: '個人首頁',
            type: Url,
        },
        facebook: {
            label: 'Facebook',
            type: Url,
        },
        twitter: {
            label: 'Twitter',
            type: Url,
        },
        instatgram: {
            label: 'Instatgram',
            type: Url,
        },
        bio: {
            label: '個人簡介',
            type: Markdown,
        },
        anchorperson: {
            label: '主播',
            type: Checkbox,
        },
        host: {
            label: '節目主持人',
            type: Checkbox,
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
        update: allowRoles(admin, moderator, editor, owner),
        create: allowRoles(admin, moderator, editor, contributor),
        delete: allowRoles(admin),
    },
    hooks: {},
    adminConfig: {
        defaultColumns: 'slug, name, email, homepage, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
