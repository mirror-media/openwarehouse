const {
    Slug,
    Text,
    Checkbox,
    Select,
    Relationship,
} = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { logging } = require('@keystonejs/list-plugins')
const {
    admin,
    bot,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const HTML = require('../../fields/HTML')
const NewDateTime = require('../../fields/NewDateTime/index.js')
const ImageRelationship = require('../../fields/ImageRelationship')
const TextHide = require('../../fields/TextHide')
const cacheHint = require('../../helpers/cacheHint')

const { parseResolvedData } = require('../../utils/parseResolvedData')
const { emitEditLog } = require('../../utils/emitEditLog')
const { controlCharacterFilter } = require('../../utils/controlCharacterFilter')
const {
    validateIfPostNeedPublishTime,
    validateIfPublishTimeIsFutureTime,
} = require('../../utils/publishTimeHandler')
const { publishStateExaminer } = require('../../utils/publishStateExaminer')

module.exports = {
    fields: {
        slug: {
            label: 'Slug',
            type: Slug,
            isRequired: true,
            isUnique: true,
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
            defaultValue: '',
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived, invisible',
            defaultValue: 'draft',
        },
        publishTime: {
            label: '發佈時間',
            type: NewDateTime,
        },
        categories: {
            label: '分類',
            type: Relationship,
            ref: 'Category',
            many: true,
        },
        writers: {
            label: '作者',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        photographers: {
            label: '攝影',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        cameraOperators: {
            label: '影音',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        designers: {
            label: '設計',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        engineers: {
            label: '工程',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        vocals: {
            label: '主播',
            type: Relationship,
            ref: 'Contact',
            many: true,
        },
        otherbyline: {
            label: '作者（其他）',
            type: Text,
            defaultValue: '',
        },
        heroVideo: {
            label: '影片',
            type: Relationship,
            ref: 'Video',
        },
        heroImage: {
            label: '首圖',
            // type: Relationship,
            type: ImageRelationship,
            ref: 'Image',
        },
        heroCaption: {
            label: '首圖圖說',
            type: Text,
            defaultValue: '',
        },
        heroImageSize: {
            label: '首圖尺寸',
            type: Select,
            options: 'extend, normal, small',
            defaultValue: 'normal',
            /*dependsOn: {
                heroImage: {
                    '$regex': '.+/i'
                }
            }*/
        },
        style: {
            label: '樣式',
            type: Select,
            options:
                'article, videoNews, wide, projects, photography, script, campaign, readr',
            // defaultValue: 'article'
            defaultValue: 'article',
        },
        brief: {
            label: '前言',
            type: HTML,
            // type: Text,
        },
        content: {
            label: '內文',
            type: HTML,
            // type: Text,
        },
        topics: {
            label: '專題',
            type: Relationship,
            ref: 'Topic',
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true,
        },
        audio: {
            label: '音檔',
            type: Relationship,
            ref: 'Audio',
        },
        relatedPosts: {
            label: '相關文章',
            type: Relationship,
            ref: 'Post',
            many: true,
        },
        relatedTopic: {
            label: '相關專題',
            type: Relationship,
            ref: 'Topic',
        },
        ogTitle: {
            label: 'FB 分享標題',
            type: Text,
            defaultValue: '',
        },
        ogDescription: {
            label: 'FB 分享說明',
            type: Text,
            defaultValue: '',
        },
        ogImage: {
            label: 'FB 分享縮圖',
            type: Relationship,
            ref: 'Image',
        },
        adTraceCode: {
            label: '追蹤代碼',
            type: Text,
            isMultiline: true,
            defaultValue: '',
        },
        isFeatured: {
            label: '置頂',
            type: Checkbox,
        },
        isAdult: {
            label: '18禁',
            type: Checkbox,
        },
        isAdvertised: {
            label: '廣告文案',
            type: Checkbox,
        },
        isAdBlocked: {
            label: 'Google 廣告違規',
            type: Checkbox,
        },
        lockTime: {
            type: NewDateTime,
            adminConfig: {
                isReadOnly: true,
            },
        },
        briefHtml: {
            label: 'Brief HTML',
            type: TextHide,
            adminConfig: {
                isReadOnly: true,
            },
        },
        briefApiData: {
            label: 'Brief API Data',
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
        contentApiData: {
            label: 'Content API Data',
            type: TextHide,
            adminConfig: {
                isReadOnly: true,
            },
        },
        source: {
            type: Text,
            label: '來源',
            adminConfig: {
                isReadOnly: true,
            },
        },
    },
    plugins: [logging((args) => emitEditLog(args)), atTracking(), byTracking()],
    plugins: [atTracking(), byTracking()],
    access: {
        update: allowRoles(admin, bot, moderator, editor, owner),
        create: allowRoles(admin, bot, moderator, editor, contributor),
        delete: allowRoles(admin),
    },
    hooks: {
        resolveInput: async ({
            existingItem,
            originalInput,
            resolvedData,
            context,
            operation,
        }) => {
            // console.log('=====resolveInput=====')
            // console.log(originalInput?.brief)
            // console.log(existingItem?.brief)
            // console.log(resolvedData?.brief)

            await controlCharacterFilter(
                originalInput,
                existingItem,
                resolvedData
            )

            await parseResolvedData(existingItem, resolvedData)
            await publishStateExaminer(
                operation,
                existingItem,
                resolvedData,
                context
            )

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
        beforeChange: async ({ existingItem, resolvedData }) => { },
    },
    adminConfig: {
        defaultColumns:
            'slug, name, state, categories, createdBy, publishTime, updatedAt',
        defaultSort: '-publishTime',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
