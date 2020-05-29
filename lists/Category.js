const { Slug, Text, Checkbox, Relationship } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const access = require('../helpers/access');

module.exports = {
    fields: {
        slug: {
            label: "Slug",
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        name: {
            label: "名稱",
            type: Text,
            isRequired: true
        },
        ogTitle: {
            label: 'FB 分享標題',
            type: Text
        },
        ogDescription: {
            label: 'FB 分享說明',
            type: Text
        },
        ogImage: {
            label: 'FB 分享縮圖',
            type: Relationship,
            ref: 'Image'
        },
        isFeatured: {
            label: '置頂',
            type: Checkbox
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: access.userIsAdminOrModerator,
        create: access.userIsAdminOrModerator,
        delete: access.userIsAdminOrModerator,
    },
    adminConfig: {
        defaultColumns: 'slug, title, isFeatured, createdAt',
        defaultSort: '-createdAt',
    },
}