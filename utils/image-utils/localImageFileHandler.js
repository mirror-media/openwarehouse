const Jimp = require('jimp')
const fs = require('fs')

const {
    generateFileNameSeperation,
    feedDimentionToApiData,
} = require('./imageApiDataHandler')
const { getDimentionFromJimpImage } = require('./imageSizeHandler')

const resizeTarget = {
    desktop: { width: 1268, height: 713 },
    tablet: { width: 1200, height: 675 },
    mobile: { width: 800, height: 450 },
    tiny: { width: 150, height: 84 },
}

function saveVariousSizeImageToLocal(newFilename, apiData) {
    return new Promise((resolve, reject) => {
        const { id, ext } = generateFileNameSeperation(newFilename)
        const now = Date.now()
        // first, get original-size image in local
        Jimp.read(`./public/images/${newFilename}`).then(image => {
            const pass = Date.now()
            const diff = pass - now
            console.log("after Jimp.read " + newFilename + ": " + diff)

            // need to get original iamge's dimention
            // in order to deciding whether is needed to scale image,
            const { width, height } = getDimentionFromJimpImage(image)

            // on the other hand, save original image dimention into apiData
            feedDimentionToApiData('original', image, apiData)

            try {
                let resizeJobs = []
                for (const resizeKey in resizeTarget) {
                    resizeJobs.push(new Promise((resolve) => {

                        // generate resized file name by resizeKey (desktop,mobile...etc)
                        const resized_filename = `${id}-${resizeKey}.${ext}`

                        // get resize frame dimention
                        const { frameWidth, frameHeight } = getFrameDimention(
                            resizeTarget,
                            resizeKey
                        )
                        // if original image is smaller than resize frame,
                        // then no need to resize, just save it to local
                        if (width < frameWidth) {
                            return saveImageToLocal(image, resized_filename)
                        } else {
                            // resize image with desired resize method
                            return image.resize(frameWidth, Jimp.AUTO)
                        }
                    }).then(image => {
                        // dont forget to save resized image's dimention to apiData
                        feedDimentionToApiData(resizeKey, image, apiData)

                        // then save it to local
                        return saveImageToLocal(image, resized_filename)
                        resolve()
                    }))
                }
                Promise.allSettled(resizeJobs).then(resolve())
            } catch (err) {
                reject(`error in save various size to local, ${err}`)
            }
        })
    })
}

function getFrameDimention(resizeTarget, resizeKey) {
    return {
        frameWidth: resizeTarget[resizeKey].width,
        frameHeight: resizeTarget[resizeKey].height,
    }
}

function saveImageToLocal(jimpImage, filename) {
    return jimpImage.writeAsync(`./public/images/${filename}`)
}

function deleteImageFromLocal(imageName) {
    const localTempFilePath = `./public/images/${imageName}`
    fs.unlink(localTempFilePath, (err) => {
        if (err) {
            throw err
        }
        console.log(`${localTempFilePath} is deleted`)
    })
}

module.exports = {
    saveVariousSizeImageToLocal,
    deleteImageFromLocal,
}
