const { Integer, Text, Relationship, Select } = require('@keystonejs/fields')
const CustomRelationship = require('../../fields/CustomRelationship')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const { logging } = require('@keystonejs/list-plugins')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/readr')
const cacheHint = require('../../helpers/cacheHint')
const HTML = require('../../fields/HTML')
const NewDateTime = require('../../fields/NewDateTime/index.js')
const ImageRelationship = require('../../fields/ImageRelationship')
const TextHide = require('../../fields/TextHide')

const { parseResolvedData } = require('../../utils/parseResolvedData')
const { emitEditLog } = require('../../utils/emitEditLog')
const { controlCharacterFilter } = require('../../utils/controlCharacterFilter')
const { countReadingTime } = require('../../utils/draftEditorHandler')
const {
    validateIfReportPostHaveSlug,
} = require('../../utils/validateIfReportPostHaveSlug')
const {
    validateIfPostNeedPublishTime,
    validateIfPublishTimeIsFutureTime,
} = require('../../utils/publishTimeHandler')

const {
    getAccessControlViaServerType,
} = require('../../helpers/ListAccessHandler')
const {
    AclRoleAccessorMethods,
} = require('@google-cloud/storage/build/src/acl')
const { generateSource } = require('../../utils/postSourceHandler')

module.exports = {
    fields: {
        sortOrder: {
            label: '排序順位',
            type: Integer,
            // isUnique: true,
        },
        slug: {
            label: 'slug',
            type: Text,
            isRequired: false,
        },
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
            defaultValue: 'untitled',
        },
        subtitle: {
            label: '副標',
            type: Text,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived',
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
        categories: {
            label: '分類',
            type: Relationship,
            ref: 'Category.relatedPost',
            many: true,
        },
        writers: {
            label: '作者',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        photographers: {
            label: '攝影',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        cameraOperators: {
            label: '影音',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        designers: {
            label: '設計',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        engineers: {
            label: '工程',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        dataAnalysts: {
            label: '數據分析',
            type: Relationship,
            ref: 'Author',
            many: true,
        },
        otherByline: {
            label: '作者（其他）',
            type: Text,
        },
        heroVideo: {
            label: '影片',
            type: Relationship,
            ref: 'Video',
        },
        heroImage: {
            label: '首圖',
            type: ImageRelationship,
            ref: 'Image',
        },
        heroCaption: {
            label: '首圖圖說',
            type: Text,
        },
        style: {
            label: '樣式',
            type: Select,
            options:
                'reviews, news, report, memo, dummy, card, qa, project3, embedded, scrollablevideo',
            defaultValue: 'news',
        },
        summary: {
            label: '重點摘要',
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
                    {
                        label: 'OL',
                        style: 'ordered-list-item',
                        icon: 'fa-list-ol',
                        text: '',
                    },
                    {
                        label: 'UL',
                        style: 'unordered-list-item',
                        icon: 'fa-list-ul',
                        text: '',
                    },
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
                ],
                entityList: {
                    LINK: {
                        type: 'LINK',
                    },
                },
            },
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
                    {
                        label: 'Code Block',
                        style: 'code-block',
                        icon: 'fa-code',
                        text: '',
                    },
                    {
                        label: 'OL',
                        style: 'ordered-list-item',
                        icon: 'fa-list-ol',
                        text: '',
                    },
                    {
                        label: 'UL',
                        style: 'unordered-list-item',
                        icon: 'fa-list-ul',
                        text: '',
                    },
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
                ],
                entityList: {
                    ANNOTATION: {
                        type: 'ANNOTATION',
                    },
                    BLOCKQUOTE: {
                        type: 'BLOCKQUOTE',
                    },
                    LINK: {
                        type: 'LINK',
                    },
                    INFOBOX: {
                        type: 'INFOBOX',
                    },
                    EMBEDDEDCODE: {
                        type: 'EMBEDDEDCODE',
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
                    SLIDESHOW: {
                        type: 'SLIDESHOW',
                        slideshowSelectionLimit: 50,
                    },
                    YOUTUBE: {
                        type: 'YOUTUBE',
                    },
                },
            },
        },
        actionList: {
            label: '延伸議題',
            type: HTML,
            editorConfig: {
                blocktypes: [
                    {
                        label: 'Normal',
                        style: 'unstyled',
                        icon: '',
                        text: 'Normal',
                    },
                    {
                        label: 'UL',
                        style: 'unordered-list-item',
                        icon: 'fa-list-ul',
                        text: '',
                    },
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
                ],
                entityList: {
                    LINK: {
                        type: 'LINK',
                    },
                },
            },
        },
        citation: {
            label: '引用數據',
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
                    {
                        label: 'Blockquote',
                        style: 'blockquote',
                        icon: 'fa-quote-left',
                        text: '',
                    },
                    {
                        label: 'UL',
                        style: 'unordered-list-item',
                        icon: 'fa-list-ul',
                        text: '',
                    },
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
                ],
                entityList: {
                    LINK: {
                        type: 'LINK',
                    },
                },
            },
        },
        readingTime: {
            label: '閱讀時間',
            type: Integer,
        },
        projects: {
            label: '專題',
            type: Relationship,
            ref: 'Project',
            many: true,
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag.relatedPost',
            many: true,
        },
        relatedPosts: {
            label: '相關文章',
            type: CustomRelationship,
            ref: 'Post',
            many: true,
        },
        ogTitle: {
            label: 'FB 分享標題',
            type: Text,
        },
        ogDescription: {
            label: 'FB 分享說明',
            type: Text,
        },
        ogImage: {
            label: 'FB 分享縮圖',
            type: Relationship,
            ref: 'Image',
        },
        summaryHtml: {
            type: TextHide,
            label: 'Summary HTML',
            adminConfig: {
                isReadOnly: true,
            },
        },
        summaryApiData: {
            type: TextHide,
            label: 'Summary API Data',
            adminConfig: {
                isReadOnly: true,
            },
        },
        contentHtml: {
            type: TextHide,
            label: 'Content HTML',
            adminConfig: {
                isReadOnly: true,
            },
        },
        contentApiData: {
            type: TextHide,
            label: 'Content API Data',
            adminConfig: {
                isReadOnly: true,
            },
        },
        actionListApiData: {
            type: TextHide,
            label: 'Action List API Data',
            adminConfig: {
                isReadOnly: true,
            },
        },
        actionListHtml: {
            type: TextHide,
            label: 'Action List HTML',
            adminConfig: {
                isReadOnly: true,
            },
        },
        citationApiData: {
            type: TextHide,
            label: 'Citation API Data',
            adminConfig: {
                isReadOnly: true,
            },
        },
        citationHtml: {
            type: TextHide,
            label: 'Citation HTML',
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
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'sortOrder,name, state, publishTime, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        resolveInput: async ({ existingItem, originalInput, resolvedData }) => {
            await controlCharacterFilter(
                originalInput,
                existingItem,
                resolvedData
            )

            await parseResolvedData(existingItem, resolvedData)

            await countReadingTime(existingItem, resolvedData)

            return resolvedData
        },
        validateInput: async ({
            existingItem,
            resolvedData,
            addValidationError,
        }) => {
            validateIfPostNeedPublishTime(
                existingItem,
                resolvedData,
                addValidationError
            )
            validateIfPublishTimeIsFutureTime(
                existingItem,
                resolvedData,
                addValidationError
            )
            validateIfReportPostHaveSlug(
                existingItem,
                resolvedData,
                addValidationError
            )
        },
        afterChange: async ({
            operation,
            existingItem,
            context,
            updatedItem,
            originalInput,
        }) => {
            emitEditLog({
                operation,
                originalInput,
                existingItem,
                context,
                updatedItem,
            })
        },
        afterDelete: async ({
            operation,
            existingItem,
            context,
            updatedItem,
            originalInput,
        }) => {
            emitEditLog({
                operation,
                originalInput,
                existingItem,
                context,
                updatedItem,
            })
        },
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
