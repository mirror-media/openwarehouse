const {
    Slug,
    Text,
    Integer,
    Checkbox,
    Select,
    Relationship,
    Url,
} = require('@keystonejs/fields')
const HTML = require('../../fields/HTML')
const TextHide = require('../../fields/TextHide')
const CustomRelationship = require('../../fields/CustomRelationship')
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

const { parseResolvedData } = require('../../utils/parseResolvedData')
const { controlCharacterFilter } = require('../../utils/controlCharacterFilter')
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
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        leading: {
            label: '標頭樣式',
            type: Select,
            options: 'video, slideshow, image, multivideo',
            defaultValue: 'image',
        },
        heroImage: {
            label: '首圖',
            type: Relationship,
            ref: 'Image',
            isRequired: true,
            /*dependsOn: {
                leading: 'image'
            }*/
        },
        heroVideo: {
            label: '影片',
            type: Relationship,
            ref: 'Video',
            /*dependsOn: {
                leading: 'video'
            }*/
        },
        slideshow: {
            label: '輪播文章',
            type: Relationship,
            ref: 'Post',
            many: true,
            /*dependsOn: {
                leading: 'slideshow'
            }*/
        },
        multivideo: {
            label: '輪播影片',
            type: Relationship,
            ref: 'Video',
            many: true,
            /*dependsOn: {
                leading: 'multivideo'
            }*/
        },
        post: {
            label: 'POST',
            type: CustomRelationship,
            ref: 'Post',
            many: true,
        },
        sortDir: {
            label: '時間軸排序方向',
            type: Select,
            options: 'asc, desc',
            defaultValue: 'desc',
        },
        categories: {
            label: '分類',
            type: Relationship,
            ref: 'Category',
            many: true,
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published',
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
        brief: {
            label: '前言',
            type: HTML,
            editorConfig: {
                blocktypes: [
                    {
                        label: 'Normal',
                        style: 'unstyled',
                        icon: '',
                        text: 'Normal',
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
                entityList: {},
            },
        },
        facebook: {
            label: 'Facebook',
            type: Url,
        },
        instagram: {
            label: 'Instagram',
            type: Url,
        },
        line: {
            label: 'Line',
            type: Url,
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
        isFeatured: {
            label: '置頂',
            type: Checkbox,
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
    },
    plugins: [
        atTracking({
            hasNowBtn: false,
            isReadOnly: true,
        }),
        byTracking(),
    ],
    access: {
        update: allowRoles(admin, moderator, editor, contributor),
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

            await parseResolvedData(existingItem, resolvedData)

            return resolvedData
        },
    },
    adminConfig: {
        defaultColumns: 'slug, title, state, leading, isFeatured, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
