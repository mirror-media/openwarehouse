const { Text, Checkbox, Select } = require('@keystonejs/fields');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');

module.exports = {
    fields: {
        name: {
            label: "名稱",
            type: Text,
            isRequired: true,
            isUnique: true
        },
        title: {
            label: "中文名稱",
            type: Text,
            isRequired: true
        },
        //heroImage: { label: '首圖', type: Types.ImageRelationship, ref: 'Image' },
        og_title: {
            label: 'FB分享標題',
            type: Text
        },
        og_description: {
            label: 'FB分享說明',
            type: Text
        },
        //og_image: { label: 'FB分享縮圖', type: Types.ImageRelationship, ref: 'Image' },
        css: {
            label: 'CSS',
            type: Text,
            isMultiline: true
        },
        javascript: {
            label: 'JavaScript',
            type: Text,
            isMultiline: true
        },
        style: {
            type: Select,
            options: 'feature, listing, tile',
            defaultValue: 'feature'
        },
        isAudioSiteOnly: {
            label: '僅用於語音網站',
            type: Checkbox
        },
        isFeatured: {
            label: '置頂',
            type: Checkbox
        },
        isCampaign: {
            label: '活動分類',
            type: Checkbox
        },
    },
    plugins: [
        atTracking(),
        byTracking(),
    ]
}
