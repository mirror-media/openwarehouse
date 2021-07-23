const fs = require('fs')
const im = require('imagickal')

const {
    generateFileNameSeperation,
    feedDimensionToApiData,
} = require('./imageApiDataHandler')
const { getDimentionFromJimpImage } = require('./imageSizeHandler')

const resizeTarget = {
    desktop: { width: 1268, height: 713 },
    tablet: { width: 1200, height: 675 },
    mobile: { width: 800, height: 450 },
    tiny: { width: 150, height: 84 },
}

function saveVariousSizeImageToLocal(newFilename, apiData) {
    const { id, ext } = generateFileNameSeperation(newFilename)
    const now = Date.now()
    // first, get original-size image in local
    const actions = {
        quality: 80,
    }
    let beforeRead = Date.now()
    const pass = Date.now()
    const diff = pass - now

    // need to get original image's dimension
    // in order to deciding whether is needed to scale image,
    let beforeIdentify = Date.now()
    return im.identify(`./public/images/${newFilename}`).then((data) => {
        let { width, height } = data
        console.log('identify file dimension as', width, height, 'takes', Date.now() - beforeIdentify)
        // on the other hand, save original image dimension into apiData
        feedDimensionToApiData('original', { width: width, height: height }, apiData)
        return { width, height }
    }).then(({ width, height }) => {
        let resizeJobs = []
        for (const resizeKey in resizeTarget) {
            resizeJobs.push(new Promise((resolve) => {
                // generate resized file name by resizeKey (desktop,mobile...etc)
                const resized_filename = `${id}-${resizeKey}.${ext}`

                // get resize frame dimension
                const { frameWidth, frameHeight } = getFrameDimension(
                    resizeTarget,
                    resizeKey
                )
                // if original image is smaller than resize frame,
                // then no need to resize, just save it to local
                if (width < frameWidth) {
                    return saveImageToLocal(image, resized_filename)
                    resolve()
                } else {
                    // resize image with desired resize method
                    im.transform(
                        fs.createReadStream(`./public/images/${newFilename}`),
                        fs.createWriteStream(`./public/images/${resized_filename}`, { encoding: 'binary' }, { strip: true }),
                        {
                            resize: { width: frameWidth, height: frameHeight }
                        }
                    ).then(() => {
                        feedDimensionToApiData(resizeKey, { width: frameWidth, height: frameHeight }, apiData)
                        resolve()
                    }
                    )
                }
            }))
        }
        return resizeJobs
    }).then((resizeJobs) => {
        console.log('I promise all')
        return Promise.all(resizeJobs).catch((err) => new Error(`error in save various size to local ${err}`))
    })
}

function getFrameDimension(resizeTarget, resizeKey) {
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
