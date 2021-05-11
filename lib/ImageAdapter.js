const { GCSAdapter } = require('./GCSAdapter.js')
// const im = require('imagemagick-stream') // not supported
const sharp = require('sharp')
const Jimp = require('jimp')

const fs = require('fs')
const path = require('path')
const moment = require('moment')
const { storage } = require('../configs/config')
const { gcpUrlBase, webUrlBase } = storage
const imageUrlBase = 'assets/images/'
const resizeTarget = {
    desktop: { width: 1268, height: 713 },
    tablet: { width: 1200, height: 675 },
    mobile: { width: 800, height: 450 },
    tiny: { width: 150, height: 84 },
}
const {
    getDimentionFromJimpImage,
    getOriginalImageDimentionInLocal,
    getUrlImageDimentions,
} = require('../utils/imageSizeHandler')

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
    }

    // No use
    async save({ stream, filename, mimetype, encoding, id }) {}

    sync_save() {
        return new Promise(async (resolve, reject) => {
            console.log('===sync_save===')
            let _meta = {}
            try {
                await this.compressAndRenameImage()
                await this.saveVariousSizeImageToLocal()

                // await this.saveOriginalImage(this.newFileName)
                // await this.saveVariousSizeImage(this.newFileName)

                // await this.generateImageApiData(this.newFileName)
                // await this.fetchAllImageSizeToApiData(this.apiData)
                // after update to gcs, delete local image
                // this.deleteLocalTempFile(this.originalFileName)

                _meta.apiData = this.apiData
                resolve(_meta)
            } catch (err) {
                reject(err)
            }
        })
    }

    compressAndRenameImage() {
        return new Promise(async (resolve, reject) => {
            try {
                const image = await Jimp.read(
                    `./public/images/${this.originalFileName}`
                ).then((image) => {
                    return image.quality(60)
                })

                await image.writeAsync(`./public/images/${this.newFileName}`)
                resolve()
            } catch (err) {
                reject(`error in compress&rename, ${err.message}`)
            }
        })
    }

    saveVariousSizeImageToLocal() {
        return new Promise(async (resolve, reject) => {
            const splitNameArray = this.newFileName.split('.')
            const id = this.id
            const ext = splitNameArray[splitNameArray.length - 1]

            // first, get original-size image in local
            const image = await Jimp.read(`./public/images/${this.newFileName}`)
            // need to get original iamge's dimention
            // not only for deciding whether is needed to scale image,
            // but save original image dimention into apiData
            const { width, height } = getDimentionFromJimpImage(image)
            this.feedDimentionToApiData('original', width, height)

            try {
                for (const resizeKey in resizeTarget) {
                    // generate resized file name by resizeKey (desktop,mobile...etc)
                    const resized_filename = `${id}-${resizeKey}.${ext}`

                    const frameWidth = resizeTarget[resizeKey].width
                    const frameHeight = resizeTarget[resizeKey].height
                    // if original image is smaller than resize frame,
                    // then no need to resize, just save it to local
                    if (width < frameWidth && height < frameHeight) {
                        await image.writeAsync(
                            `./public/images/${resized_filename}`
                        )
                    } else {
                        // resize image with desired resize method
                        await image.resize(
                            frameWidth,
                            frameHeight,
                            Jimp.RESIZE_NEAREST_NEIGHBOR
                        )

                        // dont forget to save resized image's dimention to apiData
                        const { width, height } = getDimentionFromJimpImage(
                            image
                        )
                        this.feedDimentionToApiData(resizeKey, width, height)

                        // then save it to local
                        await image.writeAsync(
                            `./public/images/${resized_filename}`
                        )
                    }
                }
                console.log(this.apiData)
                resolve()
            } catch (err) {
                reject(`error in save various size to local, ${err.message}`)
            }
        })
    }

    feedDimentionToApiData(resizeKey, width, height) {
        this.apiData[resizeKey] = { width, height }
    }

    resizeImageThenSaveToGCS(newFileName, resizeKey) {
        const stream = fs.createReadStream(
            `./public/images/${this.originalFileName}`
        )

        return new Promise(async (resolve, reject) => {
            const gcsUploadPath = `${imageUrlBase}${newFileName}`
            const file = this.bucket.file(gcsUploadPath) //get the upload path
            const write = file
                .createWriteStream()
                .on('finish', (data) => {
                    resolve()
                })
                .on('error', (err) => {
                    reject(err)
                })

            if (resizeKey) {
                // save various size image
                const resize = sharp()
                resize.resize(
                    resizeTarget[resizeKey].width,
                    resizeTarget[resizeKey].height,
                    {
                        fit: 'inside',
                    }
                )

                stream.pipe(resize).pipe(write)
            } else {
                // save original image
                stream.pipe(write)
            }
        })
    }

    deleteLocalTempFile(origFilename) {
        const localTempFilePath = `./public/images/${origFilename}`
        fs.unlink(localTempFilePath, (err) => {
            if (err) {
                throw err
            }
            console.log(`${localTempFilePath} is deleted`)
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

    generateImageApiData(newFileName) {
        return new Promise(async (resolve, reject) => {
            try {
                // generate name list
                // use it to generate each size's apiData one by one
                const imageNameList = this.generateImageNameList(newFileName)

                imageNameList.forEach((imageName) => {
                    this.createUrlToApiData(imageName)
                })

                resolve()
            } catch (err) {
                console.log(err)
                reject(err)
            }
        })
    }

    generateImageNameList(newFileName) {
        const nameList = [newFileName]
        const splitNameArray = newFileName.split('.')
        const id = splitNameArray[0]
        const ext = splitNameArray[splitNameArray.length - 1]

        for (const resizeKey in resizeTarget) {
            nameList.push(`${id}-${resizeKey}.${ext}`)
        }

        return nameList
    }

    createUrlToApiData(filename) {
        const { resizeKey } = this.generateFileNameSeperation(filename)

        if (resizeKey) {
            switch (resizeKey) {
                case 'tiny':
                    this.apiData.tiny.url = `${webUrlBase}${imageUrlBase}${filename}`
                    break
                case 'mobile':
                    this.apiData.mobile.url = `${webUrlBase}${imageUrlBase}${filename}`
                    break
                case 'tablet':
                    this.apiData.tablet.url = `${webUrlBase}${imageUrlBase}${filename}`
                    break
                case 'desktop':
                    this.apiData.desktop.url = `${webUrlBase}${imageUrlBase}${filename}`
                    break
            }
        } else {
            this.apiData.original.url = `${webUrlBase}${imageUrlBase}${filename}`
            this.apiData.url = `${webUrlBase}${imageUrlBase}${filename}`
        }
    }

    // name must be "id-size.ext" structure
    generateFileNameSeperation(newFileName) {
        const splitNameArray = newFileName.split('.')
        const ext = splitNameArray[1]
        const nameOnly = splitNameArray[0]
        const nameOnlyArray = nameOnly.split('-')

        let resizeKey = ''
        if (nameOnlyArray.length > 1) {
            resizeKey = nameOnlyArray[1]
            nameOnlyArray.pop(resizeKey)
        } else {
            resizeKey = null
        }
        const id = nameOnlyArray[0]

        return {
            id,
            resizeKey,
            ext,
        }
    }

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
}

module.exports = { ImageAdapter }
