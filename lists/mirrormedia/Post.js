const { Text, Checkbox, Select, Relationship } = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { logging } = require('@keystonejs/list-plugins')
const {
    admin,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
} = require('../../helpers/access/mirrormedia')
const HTML = require('../../fields/HTML')
const NewDateTime = require('../../fields/NewDateTime/index.js')

const { parseResolvedData } = require('../../utils/parseResolvedData')
const { emitEditLog } = require('../../utils/emitEditLog')
const { controlCharacterFilter } = require('../../utils/controlCharacterFilter')
const {
    validateIfPostNeedPublishTime,
} = require('../../utils/validateIfPostNeedPublishTime')
const { publishStateExaminer } = require('../../utils/publishStateExaminer')

module.exports = {
    fields: {
        slug: {
            label: 'slug',
            type: Text,
            isRequired: true,
        },
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
            // defaultValue: 'untitled',
        },
        subtitle: {
            label: '副標',
            type: Text,
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
            hasNowBtn: true,
            isReadOnly: false,
        },
        sections: {
            label: '分區',
            type: Relationship,
            ref: 'Section',
            many: true,
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
            type: Relationship,
            ref: 'Image',
        },
        heroCaption: {
            label: '首圖圖說',
            type: Text,
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
                'article, wide, projects, photography, script, campaign, readr',
            defaultValue: 'article',
        },
        brief: {
            label: '前言',
            type: HTML,
        },
        content: {
            label: '內文',
            type: HTML,
        },
        topic: {
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
        adTraceCode: {
            label: '追蹤代碼',
            type: Text,
            isMultiline: true,
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
        isAudioSiteOnly: {
            label: '僅用於語音網站',
            type: Checkbox,
        },
        isAdBlocked: {
            label: 'Google 廣告違規',
            type: Checkbox,
        },
        summaryHtml: {
            type: Text,
            label: 'Summary HTML',
            adminConfig: {
                isReadOnly: true,
            },
        },
        summaryApiData: {
            type: Text,
            label: 'Summary API Data',
            adminConfig: {
                isReadOnly: true,
            },
        },
        briefHtml: {
            type: Text,
            label: 'Brief HTML',
            adminConfig: {
                isReadOnly: true,
            },
        },
        briefApiData: {
            type: Text,
            label: 'Brief API Data',
            adminConfig: {
                isReadOnly: true,
            },
        },
        contentHtml: {
            type: Text,
            label: 'Content HTML',
            adminConfig: {
                isReadOnly: true,
            },
        },
        contentApiData: {
            type: Text,
            label: 'Content API Data',
            adminConfig: {
                isReadOnly: true,
            },
        },
    },
    plugins: [
        logging((args) => emitEditLog(args)),
        atTracking({
            hasNowBtn: false,
            isReadOnly: true,
        }),
        byTracking(),
    ],
    access: {
        update: allowRoles(admin, moderator, editor, owner),
        create: allowRoles(admin, moderator, editor, contributor),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'sortOrder,name, state, publishTime, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        resolveInput: async ({
            existingItem,
            originalInput,
            resolvedData,
            context,
            operation,
        }) => {
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
            validateIfPostNeedPublishTime(
                existingItem,
                resolvedData,
                addValidationError
            )
        },
        beforeChange: async ({ existingItem, resolvedData }) => {},
    },

    labelField: 'name',
}
