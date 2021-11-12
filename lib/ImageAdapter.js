const { GCSAdapter } = require('./GCSAdapter.js')
const {
    app: { project },
} = require('../configs/config.js')

const {
    returnExistedKeyValueBetweenObjects,
} = require('../utils/returnExistedKeyValueBetweenObjects')

const { getUrlImageDimentions } = require('../utils/imageSizeHandler')
const {
    generateImageApiData,
    generateImageNameListArray,
    feedDimensionToApiData,
    generateFileNameSeperation,
} = require('../utils/image-utils/imageApiDataHandler')
const {
    resizeTarget,
    deleteImageFromLocal,
} = require('../utils/image-utils/localImageFileHandler')
const { uploadBufferToGCS } = require('../utils/image-utils/uploadToGCSHandler')

const sharp = require('sharp')

const imageUrlBase = 'assets/images/'

class ImageAdapter extends GCSAdapter {
    constructor(...args) {
        super(...args)
        this.apiData = {
            url: '',
            original: {
                url: '',
                width: '',
                height: '',
            },
            desktop: {
                url: '',
                width: '',
                height: '',
            },
            tablet: {
                url: '',
                width: '',
                height: '',
            },
            mobile: {
                url: '',
                width: '',
                height: '',
            },
            tiny: {
                url: '',
                width: '',
                height: '',
            },
        }
        this.image = {}
        this.imageNameList = generateImageNameListArray(this.newFilename)
    }

    loadImage({ quality = undefined } = {}) {
        let ext = this.originalFileName.split('.').pop()
        let file = sharp(`./public/images/${this.originalFileName}`)

        if (quality != undefined) {
            file = file.toFormat(ext, { quality: quality })
        }

        return file
            .toBuffer({ resolveWithObject: true })
            .then((value) => {
                this.image.original = value
            })
            .catch((reason) => {
                console.error(reason)
                throw reason
            })
    }

    async addWatermark() {
        if (this.image.original == undefined) {
            await this.loadImage()
        }

        let file = sharp(this.image.original.data)
        return sharp(getWatermarkPath(project))
            .ensureAlpha(getWatermarkOpacity(project))
            .toBuffer()
            .then((value) => {
                return file
                    .composite([
                        { input: value, gravity: 'southeast', blend: 'add' },
                    ])
                    .toBuffer({ resolveWithObject: true })
                    .then((value) => {
                        this.image.original = value
                        return value.data
                    })
                    .catch((reason) => {
                        console.error(reason)
                        throw reason
                    })
            })
    }

    // upload original before sync_save,
    // maybe we need to upload a "no-watermark" image in the future,
    // so I decide to invoke this method in Image, not in in sync_save
    async uploadOriginalImage() {
        await uploadBufferToGCS(
            this.newFilename,
            this.image['original'].data,
            this.bucket
        )

        // HACK:
        // Although image is uploaded to gcs,
        // gcs is still need some time to process image for request
        // so in order to handle preview image error after saved image
        // we need to hold up for a little bit
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve()
            }, 1000)
        })
    }

    async sync_save() {
        if (this.image.original == undefined) {
            await this.loadImage()
        }

        return new Promise(async (resolve, reject) => {
            console.log('===sync_save===')
            let _meta = {}
            try {
                generateImageApiData(this.imageNameList, this.apiData)
                let { width, height } = this.image.original.info
                feedDimensionToApiData(
                    'original',
                    { width: width, height: height },
                    this.apiData
                )

                let file = sharp(this.image.original.data)
                let resizeJobs = []
                for (const resizeKey in resizeTarget) {
                    let count = resizeJobs.push(
                        new Promise((resolve) => {
                            // generate resized file name by resizeKey (desktop,mobile...etc)
                            const { id, ext } = generateFileNameSeperation(
                                this.newFilename
                            )

                            // FIXME redundant because of imagelist
                            const resized_filename = `${id}-${resizeKey}.${ext}`

                            let {
                                width: targetWidth,
                                height: targetHeight,
                            } = resizeTarget[resizeKey]

                            if (width < targetWidth) {
                                file.clone()
                                    .toBuffer({ resolveWithObject: true })
                                    .then((value) => {
                                        this.image[resizeKey] = value
                                        feedDimensionToApiData(
                                            resizeKey,
                                            {
                                                width: width,
                                                height: height,
                                            },
                                            this.apiData
                                        )
                                        resolve(`${resized_filename}`)
                                    })
                                    .catch((reason) => {
                                        reject(reason)
                                    })
                            } else {
                                file.clone()
                                    .resize(targetWidth, targetHeight, {
                                        fit: 'outside',
                                    })
                                    .toBuffer({ resolveWithObject: true })
                                    .then((value) => {
                                        this.image[resizeKey] = value
                                        feedDimensionToApiData(
                                            resizeKey,
                                            {
                                                width: targetWidth,
                                                height: targetHeight,
                                            },
                                            this.apiData
                                        )
                                        resolve()
                                    })
                            }
                        }).catch((reason) => {
                            reject(reason)
                        })
                    )
                }
                await Promise.all(resizeJobs).catch((err) => {
                    throw `error in resizing: ${err}`
                })

                let uploadPromises = []
                uploadPromises.push(this.uploadOriginalImage())

                for (const resizeKey in resizeTarget) {
                    // FIXME redundant because of imagelist
                    const { id, ext } = generateFileNameSeperation(
                        this.newFilename
                    )
                    const resized_filename = `${id}-${resizeKey}.${ext}`

                    uploadPromises.push(
                        uploadBufferToGCS(
                            resized_filename,
                            this.image[resizeKey].data,
                            this.bucket
                        )
                    )
                }
                await Promise.all(uploadPromises)
                    .catch((reason) => {
                        console.log(reason)
                        reject(reason)
                    })
                    .finally(() => {
                        // Delete the file at then end because somehow sharp need the file's presence to read the buffer
                        deleteImageFromLocal(this.originalFileName)
                    })
                    .catch((err) => {
                        throw `error in uploading to gcs: ${err}`
                    })
                _meta.apiData = this.apiData
                resolve(_meta)
            } catch (err) {
                reject(err)
            }
        })
    }

    resize(key, dimension = { width, height }) {
        return sharp(this.image.original.data).resize(width, height)
    }

    async delete(id, originalFilename) {
        console.log('===delete in image adapter===')
        let imageList = []

        const splitNameArray = originalFilename.split('.')
        const ext = splitNameArray[splitNameArray.length - 1]

        const gcsOriginalImgDir = `${imageUrlBase}${id}.${ext}`
        imageList.push(gcsOriginalImgDir)

        for (const key in resizeTarget) {
            const imageDir = `${imageUrlBase}${id}-${key}.${ext}`
            imageList.push(imageDir)
        }

        try {
            imageList.forEach(async (gcsImageDir) => {
                await this.bucket.file(`${gcsImageDir}`).delete()
                console.log(`gs://${gcsImageDir} deleted.`)
            })
        } catch (err) {
            console.log(err)
        }
        // console.log(`gs://${imageUrlBase}${oldImageFolderName} deleted.`)
    }

    // ------------------unuse(yet)-----------------------
    async fetchAllImageSizeToApiData(imageApiData) {
        return new Promise(async (resolve, reject) => {
            for (const resizeKey in imageApiData) {
                try {
                    if (resizeKey === 'url') continue

                    const sizeObject = imageApiData[resizeKey]
                    if (!sizeObject.url) continue

                    const { width, height } = await getUrlImageDimentions(
                        sizeObject.url
                    )
                    console.log(
                        `fetched ${resizeKey}'s dimention, width:${width} height:${height}`
                    )

                    imageApiData[resizeKey].width = width
                    imageApiData[resizeKey].height = height
                } catch (err) {
                    console.log(
                        `fail to fetch ${imageApiData[resizeKey].url} image's dimention, `,
                        err
                    )
                }
            }

            resolve()
            // for (let i = 0; i < imageUrlList.length; i++) {
            //     const imageUrl = imageUrlList[i]
            //     const { width, height } = await getUrlImageDimentions(imageUrl)
            // }
        })
    }

    generateNewImageApiData(existingItem) {
        return new Promise(async (resolve, reject) => {
            try {
                this.apiData.url = existingItem.urlOriginal
                this.apiData.original.url = existingItem.urlOriginal
                this.apiData.desktop.url = existingItem.urlDesktopSized
                this.apiData.tablet.url = existingItem.urlTabletSized
                this.apiData.mobile.url = existingItem.urlMobileSized
                this.apiData.tiny.url = existingItem.urlTinySized

                resolve(this.apiData)
            } catch (err) {
                reject(err)
            }
        })
    }

    async getMeta(path) {
        const [meta] = await this.bucket.file(path).getMetadata() //this bucket is not a function
        return meta
    }

    PublicUrl(filename) {
        let s = `https://storage.googleapis.com/${this.bucket}/${filename}`
        return s
    }

    metaHandler() {
        // // console.log('variousSizeImageNameList', this.variousSizeImageNameList)
        // this.variousSizeImageNameList.forEach(async (image) => {
        //     const gcsUploadPath = `${imageUrlBase}${image}`
        //     const meta = this.getMeta(gcsUploadPath)
        // })
    }
}

function getWatermarkPath(currentCmsName) {
    switch (currentCmsName) {
        case 'mirror-tv':
            return `./public/images/watermark-mirror-tv.png`

        case 'mirrormedia':
            return `./public/images/watermark-mirrormedia.png`
    }
}

function getWatermarkOpacity(currentCmsName) {
    switch (currentCmsName) {
        case 'mirror-tv':
            return 1

        case 'mirormedia':
            return 0.9
    }
}

function isWatermarkNeeded(resolvedData, existingItem) {
    return returnExistedKeyValueBetweenObjects(
        'needWatermark',
        resolvedData,
        existingItem
    )
}

module.exports = { ImageAdapter, isWatermarkNeeded }
