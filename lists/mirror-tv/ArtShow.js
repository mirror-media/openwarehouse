const { Relationship, Slug, Text, Select } = require('@keystonejs/fields')

const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')

const {
    admin,
    bot
    moderator,
    editor,
    contributor,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const ImageRelationship = require('../../fields/ImageRelationship')
const HTML = require('../../fields/HTML')
const NewDateTime = require('../../fields/NewDateTime/index.js')
const cacheHint = require('../../helpers/cacheHint')
const TextHide = require('../../fields/TextHide')
const { controlCharacterFilter } = require('../../utils/controlCharacterFilter')
const { parseResolvedData } = require('../../utils/parseResolvedData')
const {
    validateIfPostNeedPublishTime,
    validateIfPublishTimeIsFutureTime,
} = require('../../utils/publishTimeHandler')
module.exports = {
    fields: {
        slug: {
            label: 'Slug',
            type: Slug,
            isRequired: true,
            isUnique: true,
        },
        name: {
            label: '單集名稱',
            type: Text,
            isRequired: true,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled',
            defaultValue: 'draft',
            access: {
                // 如果user.role是contributor 那將不能發佈文章（draft以外的狀態）
                // 所以在此不給contributor有更動post.state的create/update權限
                // 但又因post.state的defaultValue是draft
                // 所以也就變相地達到contributor只能發佈draft的要求
                create: allowRoles(admin, moderator, editor),
                update: allowRoles(admin, moderator, editor),
            },
        },
        publishTime: {
            label: '發佈時間',
            type: NewDateTime,
            hasNowBtn: true,
            isReadOnly: false,
        },
        heroImage: {
            label: '首圖',
            // type: Relationship,
            type: ImageRelationship,
            ref: 'Image',
            // isRequired: true,
        },
        heroVideo: {
            label: '影片',
            type: Relationship,
            ref: 'Video',
            // isRequired: true,
        },
        content: {
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
        },
        author: {
            label: '導演',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        series: {
            label: '相關單元',
            type: Relationship,
            ref: 'Serie.post',
            many: true,
        },
        show: {
            label: '相關節目',
            type: Relationship,
            ref: 'Show',
        },
        contentApiData: {
            label: 'Content API Data',
            type: TextHide,
            adminConfig: {
                isReadOnly: true,
            },
        },
        contentHtml: {
            label: 'Content HTML',
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
        update: allowRoles(admin, moderator, editor, contributor, bot),
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

            await parseResolvedData(existingItem, resolvedData, ['content'])

            return resolvedData
        },
        validateInput: async ({
            existingItem,
            resolvedData,
            addValidationError,
        }) => {
            await validateIfPostNeedPublishTime(
                existingItem,
                resolvedData,
                addValidationError
            )
            await validateIfPublishTimeIsFutureTime(
                existingItem,
                resolvedData,
                addValidationError
            )
        },
        beforeChange: async ({ existingItem, resolvedData }) => {},
    },
    adminConfig: {
        // defaultColumns: 'schedule, time, updatedAt',
        // defaultSort: '-updatedAt',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
