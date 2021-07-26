const { Readable } = require('stream')

const imageUrlBase = 'assets/images/'

function uploadBufferToGCS(fileName, buffer, bucket) {
    return new Promise((resolve, reject) => {
        const gcsUploadPath = `${imageUrlBase}${fileName}`
        let writer = bucket.file(gcsUploadPath).createWriteStream({
            contentType: 'auto',
            gzip: true,
        })

        let reader = Readable.from(buffer)
        reader.on('end', () => {
            console.log('uploaded', gcsUploadPath)
            resolve()
        })
        reader.on('error', (err) => {
            console.error(err)
            reject(err)
        })

        reader.pipe(writer)
    })
}

module.exports = { uploadBufferToGCS }
