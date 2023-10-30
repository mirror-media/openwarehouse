const {
    Relationship,
    Slug,
    Text,
    Url,
    Checkbox,
    Integer,
} = require('@keystonejs/fields')

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
            label: '節目名稱',
            type: Text,
            isRequired: true,
        },
        sections: {
            label: '相關索引',
            type: Relationship,
            ref: 'Section.show',
            many: true,
        },
        isArtShow: {
            label: '藝文節目',
            type: Checkbox,
        },
        bannerImg: {
            label: 'banner',
            type: ImageRelationship,
            ref: 'Image',
            many: false,
            isRequired: true,
        },
        picture: {
            label: '圖片',
            type: ImageRelationship,
            ref: 'Image',
            many: false,
        },
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },

        introduction: {
            label: '簡介',
            type: Text,
            isMultiline: true,
        },
        hostName: {
            label: '主持人姓名',
            type: Relationship,
            ref: 'Contact.relatedShows',
            many: true,
        },
        staffName: {
            label: '工作人員姓名',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        igUrl: {
            label: 'IG 連結',
            type: Url,
        },
        facebookUrl: {
            label: 'facebook 粉專連結',
            type: Url,
        },
        playList01: {
            label: 'Youtube播放清單1',
            type: Url,
        },
        playList02: {
            label: 'Youtube播放清單2',
            type: Url,
        },
        trailerPlaylist: {
            label: '預告清單',
            type: Url,
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
        update: allowRoles(admin, moderator, editor),
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin, moderator),
    },
    hooks: {
        beforeChange: async ({ existingItem, resolvedData }) => {
            console.log(resolvedData.introduction)
        },
    },
    adminConfig: {
        defaultColumns: 'sortOrder, updatedAt',
        defaultSort: '-updatedAt',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
