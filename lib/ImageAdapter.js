const { GCSAdapter } = require('./GCSAdapter.js')
const { app: {
    project
} } = require('../configs/config.js')

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
const { uploadImagesToGCS } = require('../utils/image-utils/uploadToGCSHandler')

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
        this.imageNameList = []
        this.image = {}
        this.imageNameList = generateImageNameListArray(
            this.newFilename
        )
    }

    loadImage({ quality = undefined } = {}) {
        let ext = this.originalFileName.split('.').pop()

        let now = Date.now()
        console.log('read file starts at', now)
        let file = sharp(`./public/images/${this.originalFileName}`)
        console.log('read file takes', Date.now() - now)
        if (quality != undefined) {
            let now = Date.now()
            console.log('compressing file starts at', now)
            file = file.toFormat(ext, { quality: quality })
            console.log('compressing file takes', Date.now() - now)
        }

        return file.toBuffer({ resolveWithObject: true }).then((value) => {
            this.image.original = value
            return file.toFile(`./public/images/${this.newFilename}`, (err, info) => {
                if (!!err) {
                    console.error(err)
                    throw err
                }
            })
        }).catch(reason => {
            console.error(reason)
            throw reason
        })
    }

    async addWatermark() {
        if (this.image.original == undefined) {
            await this.loadImage()
        }

        let file = sharp(this.image.original.data)
        return sharp(getWatermarkPath(project)).ensureAlpha(getWatermarkOpacity(project)).toBuffer().then((value) => {
            return file.composite([{ input: value, gravity: 'southeast' }]).toBuffer({ resolveWithObject: true }).then((value => {
                this.image.original = value
            })).catch(reason => {
                console.error(reason)
                throw err
            })
        })
    }

    async sync_save() {
        if (this.image.original == undefined) { await this.loadImage() }
        return new Promise(async (resolve, reject) => {
            console.log('===sync_save===')
            let _meta = {}
            try {
                let now = Date.now()
                let apiDataStart = Date.now()
                console.log('apiData starts at', apiDataStart)
                generateImageApiData(this.imageNameList, this.apiData)
                console.log('apiData takes', Date.now() - apiDataStart)
                let resizeStart = Date.now()
                console.log('resize starts at', resizeStart)

                let { width, height } = this.image.original.info
                feedDimensionToApiData('original', { width: width, height: height }, this.apiData)

                let file = sharp(this.image.original.data)
                let resizeJobs = []
                for (const resizeKey in resizeTarget) {
                    let count = resizeJobs.push(new Promise((resolve) => {
                        console.log('in promise for', resizeKey)
                        // generate resized file name by resizeKey (desktop,mobile...etc)
                        const { id, ext } = generateFileNameSeperation(this.newFilename)
                        const resized_filename = `${id}-${resizeKey}.${ext}`

                        let { width: targetWidth, height: targetHeight } = resizeTarget[resizeKey]

                        if (width < targetWidth) {
                            console.log(width, '<', targetWidth)
                            file.clone().toBuffer({ resolveWithObject: true }).then((value) => {
                                this.image[resizeKey] = value
                                resolve()
                            }).catch(reason => {
                                console.error(reason)
                                throw reason
                            })
                        } else {
                            file.clone().resize(targetWidth, targetHeight).toBuffer({ resolveWithObject: true }).then((value) => {
                                this.image[resizeKey] = value
                                feedDimensionToApiData(resizeKey, { width: targetWidth, height: targetHeight }, this.apiData)
                                sharp(value.data).toFile(`./public/images/${resized_filename}`).then(info => {
                                    resolve(count)
                                }).catch(reason => {
                                    console.error(reason)
                                    throw reason
                                })
                            })
                        }
                    }).catch(reason => {
                        console.error(reason)
                        throw reason
                    }))
                }
                await Promise.all(resizeJobs).finally(() => {
                    // Delete the file at then end because somehow sharp need the file existing to read the buffer
                    deleteImageFromLocal(this.originalFileName)
                }).catch((err) => new Error(`error in save various size to local ${err}`))
                console.log('resize takes', Date.now() - resizeStart)
                console.log('sync save takes', Date.now() - now)
                // TODO avoid the file io and uploadImagesToGCS directly from buffer
                console.log('before upload' + Date.now())
                await uploadImagesToGCS(this.imageNameList, this.bucket)
                console.log('after upload' + Date.now())

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

module.exports = { ImageAdapter }
