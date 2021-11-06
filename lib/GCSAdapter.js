const { Storage } = require('@google-cloud/storage')
const moment = require('moment')
const path = require('path')
const gcskeyfile = './configs/gcskeyfile.json'
const fs = require('fs')
// const { getAudioDurationInSeconds } = require('get-audio-duration')
// const { getVideoDurationInSeconds } = require('get-video-duration')
const { resolve } = require('path')
const {
    storage: { bucket, webUrlBase },
} = require('../configs/config')

// process.env.GOOGLE_APPLICATION_CREDENTIALS = 'configs/gcskeyfile.json'
// GOOGLE_APPLICATION_CREDENTIALS

module.exports.GCSAdapter = class {
    constructor(
        mediaUrlBase,
        originalFileName,
        newFilename,
        id,
        gcskeyfilePath = gcskeyfile
    ) {
        gcskeyfilePath = path.resolve(gcskeyfile)
        console.log('THE gcskeyfile Path:', gcskeyfilePath)
        console.log('webUrlBase', webUrlBase)
        console.log('mediaUrlBase', mediaUrlBase)
        if (!gcskeyfilePath) {
            throw new Error(
                'GCSAdapter needs you specifies GOOGLE_APPLICATION_CREDENTIALS, should be a string path'
            )
        }
        process.env.GOOGLE_APPLICATION_CREDENTIALS = gcskeyfilePath
        this.storage = new Storage()
        this.bucket = this.storage.bucket(bucket)
        this.mediaUrlBase = mediaUrlBase
        this.originalFileName = originalFileName
        this.newFilename = newFilename
        this.id = id
    }

    getFilename({ id, originalFilename }) {
        // return `${id}-${originalFilename}`
        return this.originalFileName
    }

    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload
    // https://googleapis.dev/nodejs/storage/latest/File.html#createWriteStream
    async save({ stream, filename, mimetype, encoding, id }) {
        console.log('===save===')
        console.log('mimetype', mimetype)
        let _meta = {}

        var { file, baseName, uploadedName } = this.prepareUpload(filename, id) //filename saved on GCS

        // stream = await this.getDuration(id, stream, mimetype, _meta)

        try {
            await this.uploadFile(stream, file, baseName)

            var mimeInfo = await file.getMetadata()
        } catch (err) {
            console.log(err.message)
        }

        _meta.mimeInfo = mimeInfo
        _meta.url = this.publicUrl(uploadedName)

        let newLocal = `./${id}_tmp`
        fs.unlink(newLocal, function (err) {
            if (err) {
                throw err
            }
            console.log(`${newLocal} is deleted`)
        })
        return { id, filename, _meta }
    }

    async getDuration(id, stream, mimetype, _meta) {
        let newLocal = `./${id}_tmp`
        let write = fs.createWriteStream(newLocal)

        await new Promise((resolve, reject) => {
            stream.pipe(write).on('finish', async () => {
                if (mimetype.match('^video/*')) {
                    var duration = await getVideoDurationInSeconds(newLocal)
                    resolve(Math.round(duration))
                } else if (mimetype.match('^audio/')) {
                    var duration = await getAudioDurationInSeconds(newLocal)
                    resolve(Math.round(duration))
                }
                console.log('DURATION: ', Math.round(duration))
                _meta.duration = Math.round(duration)
            })
        })

        stream = fs.createReadStream(newLocal)
        //fs.unlink(newLocal, function (err) {
        //    if (err) {
        //        throw err
        //    }
        //    console.log(`${newLocal} is deleted`)
        //})
        return stream
    }

    prepareUpload(filename, id) {
        const baseName = path.basename(filename)
        let ext = baseName.split('.')[1]
        let uploadedName = `${id}.${ext}`
        let file = this.bucket.file(`${this.mediaUrlBase}${uploadedName}`) //filename saved on GCS
        return { file, baseName, uploadedName }
    }

    async uploadFile(stream, file, baseName) {
        return new Promise((resolve, reject) => {
            const write = file.createWriteStream(this.getOptions(baseName))
            stream.pipe(write)
            write
                .on('error', function (err) {
                    console.log('err in upload file', err)
                    reject(err)
                })
                .on('finish', function () {
                    // file.makePublic((err, apiResponse) => {
                    //     if (err) {
                    //         console.log('err in makePublic', err)
                    //         return reject(err)
                    //     }
                    //     resolve(apiResponse)
                    // })
                    resolve()
                })
        })
    }

    getOptions(filename) {
        // let destination = `${this.mediaUrlBase}${filename}`
        let options = {
            gzip: false,
            // destination: destination,
            metadata: {
                cacheControl: 'public, max-age=31536000',
            },
            //public: true
        }
        return options
    }

    async delete(id, originalFilename) {
        return new Promise(async (resolve, reject) => {
            console.log('===delete in gcs adapter===')
            let ext = originalFilename.split('.')[1]
            console.log(`ready to delete ${id}.${ext} in gcs`)

            const mediaDir = `${this.mediaUrlBase}${id}.${ext}`
            try {
                await this.bucket.file(mediaDir).delete()

                console.log(`gs://$${mediaDir} deleted.`)
                resolve()
            } catch (err) {
                console.log(err.message)
                reject(err)
            }
        })
    }

    async makePublic(filename) {
        // Makes the file public

        //await this.bucket.file(`${this.mediaUrlBase}{filename}`).makePublic()

        console.log(`gs://${filename} is now public.`)
    }

    publicUrl(filename) {
        let s = `${webUrlBase}${this.mediaUrlBase}${filename}`
        return s
    }
}
