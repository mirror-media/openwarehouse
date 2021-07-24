const { getDimentionFromJimpImage } = require('./imageSizeHandler')

const { storage } = require('../../configs/config')
const { gcpUrlBase, webUrlBase } = storage
const imageUrlBase = 'assets/images/'

const resizeTarget = {
    desktop: { width: 1268, height: 713 },
    tablet: { width: 1200, height: 675 },
    mobile: { width: 800, height: 450 },
    tiny: { width: 150, height: 84 },
}

function generateImageApiData(imageNameList, apiData) {
    imageNameList.forEach((imageName) => {
        createUrlToApiData(imageName, apiData)
    })
}

function generateImageNameListArray(newFilename) {
    const nameList = [newFilename]
    const splitNameArray = newFilename.split('.')
    const id = splitNameArray[0]
    const ext = splitNameArray[splitNameArray.length - 1]

    for (const resizeKey in resizeTarget) {
        nameList.push(`${id}-${resizeKey}.${ext}`)
    }

    return nameList
}

function createUrlToApiData(filename, apiData) {
    const { resizeKey } = generateFileNameSeperation(filename)
    if (resizeKey) {
        switch (resizeKey) {
            case 'tiny':
                apiData.tiny.url = `${webUrlBase}${imageUrlBase}${filename}`
                break
            case 'mobile':
                apiData.mobile.url = `${webUrlBase}${imageUrlBase}${filename}`
                break
            case 'tablet':
                apiData.tablet.url = `${webUrlBase}${imageUrlBase}${filename}`
                break
            case 'desktop':
                apiData.desktop.url = `${webUrlBase}${imageUrlBase}${filename}`
                break
        }
    } else {
        apiData.original.url = `${webUrlBase}${imageUrlBase}${filename}`
        apiData.url = `${webUrlBase}${imageUrlBase}${filename}`
    }
}

// name must be "id-size.ext" structure
function generateFileNameSeperation(newFilename) {
    const splitNameArray = newFilename.split('.')
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

function feedDimensionToApiData(resizeKey, { width, height } = {}, apiData) {
    apiData[resizeKey] = { ...apiData[resizeKey], width, height }
}

module.exports = {
    generateImageApiData,
    generateFileNameSeperation,
    feedDimensionToApiData,
    generateImageNameListArray,
}
