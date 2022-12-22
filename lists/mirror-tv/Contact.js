const { Integer, Slug, Text, Url, Checkbox, Relationship } = require('@keystonejs/fields')
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
const { parseResolvedData } = require('../../utils/parseResolvedData')

module.exports = {
    fields: {
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
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
            label: '長方形圖',
            type: ImageRelationship,
            ref: 'Image',
        },
        showhostImg: {
            label: '正方形圖',
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
        relatedShows: {
            label: '關聯藝文節目',
            type: Relationship,
            ref: 'Show.hostName',
            many: true,
        },
        relatedSeries: {
            label: '關聯節目單元',
            type: Relationship,
            ref: 'Serie.relatedContacts',
            many: true,
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
        isResigned: {
            label: '已離職',
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

            await parseResolvedData(existingItem, resolvedData, ['bio'])

            return resolvedData
        },
    },
    adminConfig: {
        defaultColumns: 'sortOrder, slug, createdAt',
        defaultSort: '-createdAt',
    },
    labelResolver: async(item) => {
        const contactLabel = item.isResigned?  `${item.name} (已離職)`: item.name
        return contactLabel
        },
    cacheHint: cacheHint,
}
