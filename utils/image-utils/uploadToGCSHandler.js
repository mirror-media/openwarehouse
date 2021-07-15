const fs = require('fs')
const imageUrlBase = 'assets/images/'
const { deleteImageFromLocal } = require('../image-utils/localImageFileHandler')

function uploadImagesToGCS(imageNameList, bucket) {
    return new Promise(async (resolve, reject) => {
        try {
            // need to ensure first image is uploaded
            // (or CMS won't have file snapshot)
            await saveLocalImageToGCS(imageNameList[0], bucket)

            // however, for loop can't handle async function
            // so we need to seperate first upload
            for (let i = 1; i < imageNameList.length; i++) {
                saveLocalImageToGCS(imageNameList[i], bucket)
            }

            resolve()
        } catch (err) {
            reject(`error in upload images to GCS, ${err}`)
        }
    })
}
function saveLocalImageToGCS(fileName, bucket) {
    const stream = fs.createReadStream(`./public/images/${fileName}`)

    return new Promise(async (resolve, reject) => {
        const gcsUploadPath = `${imageUrlBase}${fileName}`
        const file = bucket.file(gcsUploadPath) //get the upload path
        const write = file
            .createWriteStream()
            .on('finish', (data) => {
                console.log(`${fileName} has been uploaded to GCS`)

                // after update to gcs, delete local image
                deleteImageFromLocal(fileName)
                resolve()
            })
            .on('error', (err) => {
                reject(`error in upload image to GCS, ${err}`)
            })

        stream.pipe(write)
    })
}

module.exports = { uploadImagesToGCS }
