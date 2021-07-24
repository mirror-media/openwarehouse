const probe = require('probe-image-size')
const { ImageAdapter } = require('../lib/ImageAdapter')

const resizeTarget = {
    desktop: { width: 1268, height: 713 },
    tablet: { width: 1200, height: 675 },
    mobile: { width: 800, height: 450 },
    tiny: { width: 150, height: 84 },
}

function getUrlImageDimentions(url) {
    return new Promise(async (resolve, reject) => {
        try {
            let result = await probe(url, { rejectUnauthorized: false })
            resolve({ width: result.width, height: result.height })
        } catch (err) {
            reject(err)
        }
    })
}

function generateImageApiDataFromExistingItem(existingItem) {
    console.log(ImageAdapter)
    const originalFileName = existingItem.file.filename
    const id = existingItem.file.id
    const image_adapter = new ImageAdapter(originalFileName, '', id)

    return new Promise(async (resolve, reject) => {
        try {
            const apiData = await image_adapter.generateNewImageApiData(
                existingItem
            )

            resolve(JSON.stringify(apiData))
        } catch (err) {
            reject(err)
        }
    })
}

module.exports = {
    getUrlImageDimentions,
    generateImageApiDataFromExistingItem,
}
