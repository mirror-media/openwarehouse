const { Slug, Text, Url, Relationship } = require('@keystonejs/fields');
const { Markdown } = require('@keystonejs/fields-markdown');
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
            label: '姓名',
            type: Text,
            isRequired: true
        },
        email: {
            label: 'Email',
            type: Text
        },
        image: {
            label: '圖片',
            type: Relationship,
            ref: 'Image'
        },
        homepage: {
            label: '個人首頁',
            type: Url
        },
        facebook: {
            label: 'Facebook',
            type: Url
        },
        twitter: {
            label: 'Twitter',
            type: Url
        },
        instatgram: {
            label: 'Instatgram',
            type: Url
        },
        bio: {
            label: '個人簡介',
            type: Markdown
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        read: access.userIsNotContributor,
        update: access.userIsAdminOrModerator,
        create: access.userIsAdminOrModerator,
        delete: access.userIsAdmin,
    },
    adminConfig: {
        defaultColumns: 'slug, name, email, homepage, createdAt',
        defaultSort: '-createdAt',
    },
}