const {
    Text,
    Select,
    Relationship,
    File,
    Url,
    Checkbox,
} = require('@keystonejs/fields')
const { atTracking, byTracking } = require('@keystonejs/list-plugins')
const { ImageAdapter } = require('../../lib/ImageAdapter')
const { LocalFileAdapter } = require('@keystonejs/file-adapters')
const TextHide = require('../../fields/TextHide')
const fs = require('fs')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/mirrormedia')
const cacheHint = require('../../helpers/cacheHint')
const gcsDir = 'assets/images/'
const { addWatermarkIfNeeded } = require('../../utils/watermarkHandler')
const {
    getNewFilename,
    getFileDetail,
} = require('../../utils/fileDetailHandler')

const {
    storage: { gcpUrlBase },
} = require('../../configs/config')

const fileAdapter = new LocalFileAdapter({
    src: './public/images',
    path: `${gcpUrlBase}assets/images`, //function({id, }){}
})

module.exports = {
    fields: {
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        file: {
            label: '檔案',
            type: File,
            adapter: fileAdapter,
            isRequired: true,
        },
        copyright: {
            label: '版權',
            type: Select,
            dataType: 'string',
            options: 'Creative-Commons, Copyrighted',
            defaultValue: 'Copyrighted',
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
        needWatermark: {
            label: 'Need watermark?',
            type: Checkbox,
        },
        keywords: {
            label: '關鍵字',
            type: Text,
        },
        meta: {
            label: '中繼資料',
            type: Text,
        },
        urlOriginal: {
            type: Url,
            adminConfig: {
                isReadOnly: true,
            },
        },
        urlDesktopSized: {
            type: Url,
            adminConfig: {
                isReadOnly: true,
            },
        },
        urlMobileSized: {
            type: Url,
            adminConfig: {
                isReadOnly: true,
            },
        },
        urlTabletSized: {
            type: Url,
            adminConfig: {
                isReadOnly: true,
            },
        },
        urlTinySized: {
            type: Url,
            adminConfig: {
                isReadOnly: true,
            },
        },
        imageApiData: {
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
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'name, image, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        // Hooks for create and update operations

        beforeChange: async ({ existingItem, resolvedData }) => {
            try {
                // resolvedData = true
                // when create or update newer image
                if (typeof resolvedData.file !== 'undefined') {
                    // await addWatermarkIfNeeded(resolvedData, existingItem)
                    let now = Date.now()
                    const { id, newFilename, originalFileName } = getFileDetail(
                        resolvedData
                    )
                    // upload image to gcs,and generate corespond meta data(url )
                    const image_adapter = new ImageAdapter(
                        mediaUrlBase,
                        originalFileName,
                        newFilename,
                        id
                    )
                    await image_adapter.loadImage({ quality: 80 })

                    if (isWatermarkNeeded(resolvedData, existingItem)) {
                        let now = Date.now()
                        console.log('add watermark at', now)
                        await image_adapter.addWatermark()
                        console.log('adding watermark takes', Date.now() - now)
                    }

                    let _meta = await image_adapter.sync_save()

                    // existingItem = true
                    // update image
                    // need to delete old image in gcs
                    if (typeof existingItem !== 'undefined') {
                        console.log('---update image---')

                        await image_adapter.delete(
                            existingItem.file.id,
                            existingItem.file.originalFilename
                        )
                        console.log('deleted old one')
                    }

                    // import each url into resolvedData
                    resolvedData.urlOriginal = _meta.apiData.original.url
                    resolvedData.urlDesktopSized = _meta.apiData.desktop.url
                    resolvedData.urlTabletSized = _meta.apiData.tablet.url
                    resolvedData.urlMobileSized = _meta.apiData.mobile.url
                    resolvedData.urlTinySized = _meta.apiData.tiny.url

                    // generate imageApiData to resolvedData
                    resolvedData.imageApiData = JSON.stringify(_meta.apiData)

                    // update stored filename
                    // filename ex: 5ff2779ebcfb3420789bf003-image.jpg
                    resolvedData.file.filename = getNewFilename(resolvedData)
                } else {
                    // resolvedData = false
                    // image is no needed to update
                    console.log('no need to update stream')

                    // if there's no image api data, fetch it
                    if (!existingItem.imageApiData) {
                        const id = existingItem.id
                        const image_adapter = new ImageAdapter(id)

                        const apiData = await image_adapter.generateNewImageApiData(
                            existingItem
                        )
                        resolvedData.imageApiData = apiData
                    }
                }

                return { existingItem, resolvedData }
            } catch (err) {
                console.log(`error in hook: `, err.message)
            }
        },
        // When delete image, delete image in gcs as well
        beforeDelete: async ({ existingItem }) => {
            const image_adapter = new ImageAdapter(gcsDir)

            if (existingItem && typeof existingItem.file !== 'undefined') {
                await image_adapter.delete(
                    existingItem.file.id,
                    existingItem.file.originalFilename
                )
                console.log('deleted old one')
            }
        },
        /*
        resolveInput: ({ operation, existingItem, resolvedData, originalInput }) => {
            if (resolvedData.file) {
                resolvedData.urlOriginal = resolvedData.file._meta.url.urlOriginal
                resolvedData.urlDesktopSized = resolvedData.file._meta.url.urlDesktopSized
                resolvedData.urlMobileSized = resolvedData.file._meta.url.urlMobileSized
                resolvedData.urlTabletSized = resolvedData.file._meta.url.urlTabletSized
                resolvedData.urlTinySized = resolvedData.file._meta.url.urlTinySized
            }

            console.log("resolveInput RESOLVED DATA", resolvedData)
            return resolvedData
        },
        */
    },
    labelField: 'name',
}
