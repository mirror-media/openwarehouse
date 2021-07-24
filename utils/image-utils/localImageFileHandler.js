const fs = require('fs')
const sharp = require('sharp')

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
    resizeTarget,
    deleteImageFromLocal,
}
