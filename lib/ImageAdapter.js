const { GCSAdapter } = require('./GCSAdapter.js')
// const im = require('imagemagick-stream') // not supported
const Jimp = require('jimp')
const im = require('imagickal')

const { getUrlImageDimentions } = require('../utils/imageSizeHandler')
const {
    generateImageApiData,
    generateImageNameListArray,
} = require('../utils/image-utils/imageApiDataHandler')
const {
    saveVariousSizeImageToLocal,
    deleteImageFromLocal,
} = require('../utils/image-utils/localImageFileHandler')
const { uploadImagesToGCS } = require('../utils/image-utils/uploadToGCSHandler')

const imageUrlBase = 'assets/images/'
const resizeTarget = {
    desktop: { width: 1268, height: 713 },
    tablet: { width: 1200, height: 675 },
    mobile: { width: 800, height: 450 },
    tiny: { width: 150, height: 84 },
}

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
    }

    sync_save() {
        return new Promise(async (resolve, reject) => {
            console.log('===sync_save===')
            let _meta = {}
            try {
                this.imageNameList = generateImageNameListArray(
                    this.newFilename
                )
                let now = Date.now()
                console.log('compress starts at', now)
                await this.compressAndRenameImage()
                console.log('compress takes', Date.now() - now)
                let apiDataStart = Date.now()
                console.log('apiData starts at', apiDataStart)
                await generateImageApiData(this.imageNameList, this.apiData)
                console.log('apiData takes', Date.now() - apiDataStart)
                let resizeStart = Date.now()
                console.log('resize starts at', resizeStart)
                await saveVariousSizeImageToLocal(
                    this.newFilename,
                    this.apiData
                )
                console.log('resize takes', Date.now() - resizeStart)
                console.log('sync save takes', Date.now() - now)
                await uploadImagesToGCS(this.imageNameList, this.bucket)
                console.log('after upload' + Date.now())

                _meta.apiData = this.apiData
                resolve(_meta)
            } catch (err) {
                reject(err)
            }
        })
    }

    compressAndRenameImage() {
        const actions = {
            quality: 80,
        }
        let compressStarts = Date.now()
        console.log('before compress - change quality:', compressStarts)
        return im
            .transform(
                `./public/images/${this.originalFileName}`,
                `./public/images/${this.newFilename}`,
                actions
            )
            .then(() => {
                console.log('Compress image Done')
                console.log('compress takes', Date.now() - compressStarts)
                // after compressed image, delete original one
                deleteImageFromLocal(this.originalFileName)
            })
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

module.exports = { ImageAdapter }
