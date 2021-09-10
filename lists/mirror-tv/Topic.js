const {
    Slug,
    Text,
    Integer,
    Checkbox,
    Select,
    Relationship,
} = require('@keystonejs/fields')
const HTML = require('../../fields/HTML')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const { uuid } = require('uuidv4')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')

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
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
            /*dependsOn: {
                type: 'timeline'
            }*/
        },
        post: {
            label: 'POST',
            type: Relationship,
            ref: 'Post',
            many: true,
        },
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        subtitle: {
            label: '副標',
            type: Text,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published',
            defaultValue: 'draft',
        },
        brief: {
            label: '前言',
            type: HTML,
        },
        leading: {
            label: '標頭樣式',
            type: Select,
            options: 'video, slideshow, image',
        },
        categories: {
            label: '分類',
            type: Relationship,
            ref: 'Category',
            many: true,
        },
        heroVideo: {
            label: '影片',
            type: Relationship,
            ref: 'Video',
            /*dependsOn: {
                leading: 'video'
            }*/
        },
        heroImage: {
            label: '首圖',
            type: Relationship,
            ref: 'Image',
            /*dependsOn: {
                leading: 'image'
            }*/
        },
        heroImageSize: {
            label: '首圖尺寸',
            type: Select,
            options: 'extend, normal, small',
            default: 'normal',
            /*dependsOn: {
                heroImage: {
                    '$regex': '.+/i'
                }
            }*/
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
        titleStyle: {
            label: '標題樣式',
            type: Select,
            options: 'feature, wide',
            defaultValue: 'feature',
        },
        type: {
            label: '型態',
            type: Select,
            dataType: 'string',
            options: 'list, timeline, group, portrait wall, wide',
            defaultValue: 'list',
        },
        source: {
            label: '資料來源',
            type: Select,
            options: 'posts, activities',
            /*dependsOn: {
                type: 'timeline'
            }*/
        },
        sortDir: {
            label: '時間軸排序方向',
            type: Select,
            options: 'asc, desc',
            /*dependsOn: {
                type: 'timeline'
            }*/
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true,
        },
        css: {
            label: 'CSS',
            type: Text,
            isMultiline: true,
        },
        javascript: {
            label: 'JavaScript',
            type: Text,
            isMultiline: true,
        },
        dfp: {
            label: 'DFP Code',
            type: Text,
        },
        mobileDfp: {
            label: 'Mobile DFP Code',
            type: Text,
        },
        isFeatured: {
            label: '置頂',
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
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin, moderator),
    },
    hooks: {},
    adminConfig: {
        defaultColumns: 'slug, title, state, tags, isFeatured, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
