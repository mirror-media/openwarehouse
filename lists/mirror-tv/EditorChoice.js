const { Integer, Select, CalendarDay } = require('@keystonejs/fields')
const CustomRelationship = require('../../fields/CustomRelationship')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    bot,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')
const {
    getAccessControlViaServerType,
} = require('../../helpers/ListAccessHandler')
const addDate = (day) => {
    let today = new Date()
    today.setDate(today.getDate() + day)
    return today.toISOString().slice(0, 10)
}
module.exports = {
    fields: {
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
        choice: {
            label: '精選文章',
            type: CustomRelationship,
            ref: 'Post',
        },
        externalChoice: {
            label: '外部文章',
            type: CustomRelationship,
            ref: 'External',
        },
        publishedDate: {
            label: '上架日期（預設隔日）',
            type: CalendarDay,
        },
        expiredDate: {
            label: '下架日期（預設隔一日）',
            type: CalendarDay,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled, archived, invisible',
            defaultValue: 'draft',
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
        read: getAccessControlViaServerType(
            admin,
            bot,
            moderator,
            editor,
            contributor,
            owner
        ),
        update: allowRoles(admin, moderator, editor, bot),
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin, moderator),
    },
    hooks: {
        validateInput: ({ resolvedData, addValidationError, existingItem }) => {

            // 檢查新的輸入值
            const hasNewChoice = resolvedData.choice !== undefined && resolvedData.choice !== null
            const hasNewExternalChoice = resolvedData.externalChoice !== undefined && resolvedData.externalChoice !== null
            const isClearingChoice = resolvedData.choice === null
            const isClearingExternalChoice = resolvedData.externalChoice === null

            // 檢查現有的值
            const hasExistingChoice = existingItem?.choice !== undefined && existingItem?.choice !== null
            const hasExistingExternalChoice = existingItem?.externalChoice !== undefined && existingItem?.externalChoice !== null

            // 檢查是否同時有多個欄位被設定
            if (hasNewChoice && hasNewExternalChoice) {
                console.log('Validation error: both new fields have values')
                addValidationError('新聞內容請擇一：精選文章、精選外部文章')
                return
            }

            // 檢查是否要從一個欄位切換到另一個欄位
            if (hasNewChoice && hasExistingExternalChoice && !isClearingExternalChoice) {
                console.log('Validation error: cannot set choice when externalChoice exists')
                addValidationError('請先清空精選外部文章')
                return
            }

            if (hasNewExternalChoice && hasExistingChoice && !isClearingChoice) {
                console.log('Validation error: cannot set externalChoice when choice exists')
                addValidationError('請先清空精選文章')
                return
            }

            // 檢查是否要發布或已經是發布狀態
            const isPublished = existingItem?.state === 'published' || resolvedData.state === 'published'

            if (isPublished) {
                // 如果正在清除某個欄位，則檢查另一個欄位是否有值
                const finalHasChoice = (hasNewChoice || (hasExistingChoice && !isClearingChoice))
                const finalHasExternalChoice = (hasNewExternalChoice || (hasExistingExternalChoice && !isClearingExternalChoice))

                if (!finalHasChoice && !finalHasExternalChoice) {
                    console.log('Validation error: no values in published state')
                    addValidationError('發布狀態下，精選文章、精選外部文章不能同時為空')
                    return
                }
            }
        }
    },
    adminConfig: {
        defaultColumns: 'choice, state, createdAt',
        defaultSort: '-createdAt',
    },
    cacheHint: cacheHint,
}
