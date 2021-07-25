const imageUrlBase = 'assets/images/'

function uploadBufferToGCS(fileName, buffer, bucket) {
    const gcsUploadPath = `${imageUrlBase}${fileName}`
    return new Promise((resolve, reject) => {
        let stream = bucket.file(gcsUploadPath).createWriteStream({
            contentType: 'auto',
            gzip: true,
            resumable: false,
        })
        stream.end(buffer)
        stream.once('error', (err) => {
            reject(err)
        });
        stream.once('finish', () => {
            resolve(gcsUploadPath)
        });
    })
}

module.exports = { uploadBufferToGCS }
