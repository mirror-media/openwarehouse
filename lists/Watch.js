const { Slug, Text, Relationship, Select, Integer, Checkbox, Url } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { uuid } = require('uuidv4');
const access = require('../helpers/access');

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
            }
        },
        name: {
            label: '名稱',
            type: Text,
            isRequired: true
        },
        brand: {
            label: '品牌',
            type: Relationship,
            ref: 'WatchBrand.watches'
        },
        type: {
            label: '型號',
            type: Text
        },
        style: {
            label: '樣式',
            type: Text
        },
        series: {
            label: '系列',
            type: Text
        },
        watchImage: {
            label: '圖片',
            type: Relationship,
            ref: 'Image'
        },
        price: {
            label: '價格',
            type: Text
        },
        publishedYear: {
            label: '發表年份',
            type: Text
        },
        limit: {
            label: '限量支數',
            type: Integer
        },
        sex: {
            label: '性別',
            type: Select,
            dataType: 'string',
            options: '男錶款, 女錶款, 中性錶款',
            defaultValue: '中性錶款'
        },
        isLuminous: {
            label: '夜光',
            type: Checkbox
        },
        movement: {
            label: '機芯',
            type: Select,
            dataType: 'string',
            options: '自動上鏈, 手動上鏈, 石英, 光動能, 人動電能, GPS, 電波, 智能錶'
        },
        power: {
            label: '動力',
            type: Text
        },
        size: {
            label: '錶殼尺寸',
            type: Text
        },
        color: {
            label: '面盤顏色',
            type: Text
        },
        youtube: {
            label: 'Youtube 影片',
            type: Url
        },
        functions: {
            label: '功能',
            type: Relationship,
            ref: 'WatchFunction',
            many: true
        },
        material: {
            label: '材質',
            type: Select,
            dataType: 'string',
            options: '不鏽鋼, 半金, 銅, 黃金, 玫瑰金, 白金, 鉑金, 鉑金, 鈦金屬, 特殊合金, 複合材質'
        },
        waterproof: {
            label: '防水',
            type: Select,
            dataType: 'string',
            options: '無, 30米, 50米, 100米, 200米, 300米, 600米, 1000米, 2000米, 2000米, 4000米'
        },
        //content: { label: '內文', type: Types.Html, wysiwyg: true, height: 400 },
        relatedPosts: {
            label: '相關文章',
            type: Relationship,
            ref: 'Post',
            many: true
        },
        relatedwatches: {
            label: '相關錶款',
            type: Relationship,
            ref: 'Watch',
            many: true
        },
        stores: {
            label: '錶店',
            type: Relationship,
            ref: 'WatchStore.watches',
            many: true
        },
        isPopular: {
            label: '熱門錶款',
            type: Checkbox
        },
        isTreasury: {
            label: '庫藏區',
            type: Checkbox
        },
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: access.userIsAboveAuthorOrOwner,
        create: access.userIsNotContributor,
        delete: access.userIsAboveAuthorOrOwner,
    },
    adminConfig: {
        defaultColumns: 'slug, name, brand, series, type, movement, createdAt',
        defaultSort: '-createdAt',
    },
}