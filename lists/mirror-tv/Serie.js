const { Relationship, Slug, Text } = require('@keystonejs/fields')

const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const ImageRelationship = require('../../fields/ImageRelationship')
const HTML = require('../../fields/HTML')
const cacheHint = require('../../helpers/cacheHint')
const TextHide = require('../../fields/TextHide')
const { controlCharacterFilter } = require('../../utils/controlCharacterFilter')
const { parseResolvedData } = require('../../utils/parseResolvedData')

module.exports = {
    fields: {
        slug: {
            label: 'Slug',
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        name: {
            label: '單元名稱',
            type: Text,
            isRequired: true,
        },
        heroImage: {
            label: '首圖',
            // type: Relationship,
            type: ImageRelationship,
            ref: 'Image',
        },
        introduction: {
            label: '內文',
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
            // type: Text,
        },
        section: {
            label: '相關索引',
            type: Relationship,
            ref: 'Section.series',
            many: true,
        },
        post: {
            label: '相關單集',
            type: Relationship,
            ref: 'ArtShow.series',
            many: true,
        },
        introductionApiData: {
            label: 'Introduction API Data',
            type: TextHide,
            adminConfig: {
                isReadOnly: true,
            },
        },
        introductionHtml: {
            label: 'Introduction HTML',
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
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin, moderator),
    },
    hooks: {
        resolveInput: async ({ existingItem, originalInput, resolvedData }) => {
            await controlCharacterFilter(
                originalInput,
                existingItem,
                resolvedData
            )

            await parseResolvedData(existingItem, resolvedData, [
                'introduction',
            ])

            return resolvedData
        },
        beforeChange: async ({ existingItem, resolvedData }) => {},
    },
    adminConfig: {
        defaultColumns: 'name, slug, updatedAt',
        defaultSort: '-updatedAt',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
