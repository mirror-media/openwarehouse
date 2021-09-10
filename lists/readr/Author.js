const { Slug, Text, Url, Relationship } = require('@keystonejs/fields')
const { Markdown } = require('@keystonejs/fields-markdown')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { uuid } = require('uuidv4')
const { admin, moderator, allowRoles } = require('../../helpers/access/readr')
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
        instagram: {
            label: 'Instagram',
            type: Url,
        },
        bio: {
            label: '個人簡介',
            type: Markdown,
        },
    },
    plugins: [atTracking(), byTracking()],
    access: {
        update: allowRoles(admin, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'slug, name, email, homepage, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}
