const { Slug, Text, Url, Checkbox } = require('@keystonejs/fields')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const { uuid } = require('uuidv4')
const {
    admin,
    moderator,
    editor,
    contributor,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')
const ImageRelationship = require('../../fields/ImageRelationship')
const HTML = require('../../fields/HTML')
const TextHide = require('../../fields/TextHide')
const { controlCharacterFilter } = require('../../utils/controlCharacterFilter')
const {
    parseResolvedData,
} = require('../../utils/draft-utils/parseResolvedData')

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
        anchorImg: {
            label: '圖片(大)',
            type: ImageRelationship,
            ref: 'Image',
        },
        showhostImg: {
            label: '圖片（小）',
            type: ImageRelationship,
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
            type: HTML,
            editorConfig: {
                blocktypes: [
                    {
                        label: 'Normal',
                        style: 'unstyled',
                        icon: '',
                        text: 'Normal',
                    },
                    { label: 'H1', style: 'header-one', icon: '', text: 'H1' },
                    { label: 'H2', style: 'header-two', icon: '', text: 'H2' },
                ],
                inlineStyles: [
                    { label: 'Bold', style: 'BOLD', icon: 'fa-bold', text: '' },
                    {
                        label: 'Italic',
                        style: 'ITALIC',
                        icon: 'fa-italic',
                        text: '',
                    },
                    {
                        label: 'Underline',
                        style: 'UNDERLINE',
                        icon: 'fa-underline',
                        text: '',
                    },
                    // { label: 'Monospace', style: 'CODE', icon: 'fa-terminal', text: '' },
                ],
                entityList: {
                    LINK: {
                        type: 'LINK',
                    },
                    AUDIO: {
                        type: 'AUDIO',
                    },
                    VIDEO: {
                        type: 'VIDEO',
                    },
                    IMAGE: {
                        type: 'IMAGE',
                    },
                    YOUTUBE: {
                        type: 'YOUTUBE',
                    },
                },
            },
        },
        anchorperson: {
            label: '主播',
            type: Checkbox,
        },
        host: {
            label: '節目主持人',
            type: Checkbox,
        },
        bioApiData: {
            label: 'bio API Data',
            type: TextHide,
            adminConfig: {
                isReadOnly: true,
            },
        },
        bioHtml: {
            label: 'bio HTML',
            type: TextHide,
            adminConfig: {
                isReadOnly: true,
            },
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
        create: allowRoles(admin, moderator, editor, contributor),
        delete: allowRoles(admin, moderator),
    },
    hooks: {
        resolveInput: async ({ existingItem, originalInput, resolvedData }) => {
            await controlCharacterFilter(
                originalInput,
                existingItem,
                resolvedData
            )

            await parseResolvedData({
                draftFieldNameArray: ['bio'],
                resolvedData,
            })

            return resolvedData
        },
    },
    adminConfig: {
        defaultColumns: 'slug, name, email, homepage, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
