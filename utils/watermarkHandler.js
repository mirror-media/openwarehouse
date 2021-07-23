const {
    returnExistedKeyValueBetweenObjects,
} = require('./returnExistedKeyValueBetweenObjects')
const Jimp = require('jimp')
const { app } = require('../configs/config.js')

const addWatermarkIfNeeded = async (resolvedData, existingItem) => {
    const isNeedWatermark = checkIfNeedWatermark(resolvedData, existingItem)

    let beforeWatermark = Date.now()
    console.log('addWatermarkIfNeeded starts at', beforeWatermark)

    if (isNeedWatermark) {
        let fullFileName = resolvedData.file.filename
        await addWatermark(fullFileName)
        console.log('addWatermarkIfNeeded takes', Date.now() - beforeWatermark)
    }
}

function checkIfNeedWatermark(resolvedData, existingItem) {
    return returnExistedKeyValueBetweenObjects(
        'needWatermark',
        resolvedData,
        existingItem
    )
}

async function addWatermark(fullFileName) {
    console.log(`${fullFileName} is ready to add watermark`)

    const watermark = await Jimp.read(
        getWatermarkPath(app.project)
    ).then((image) => image.rotate(180))
    const image = await Jimp.read(
        `./public/images/${fullFileName}`
    ).then((image) => image.rotate(180))

    await image.composite(watermark, 0, 0, {
        mode: Jimp.BLEND_SOURCE_OVER,
        opacityDest: 1,
        opacitySource: getWatermarkOpacity(app.project),
    })

    await image.rotate(180)

    await image.writeAsync(`./public/images/${fullFileName}`)
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

module.exports = { addWatermarkIfNeeded }
