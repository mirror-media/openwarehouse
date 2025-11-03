const { Storage } = require('@google-cloud/storage')
const moment = require('moment')
const path = require('path')
const gcskeyfile = './configs/gcskeyfile.json'
const fs = require('fs')
const os = require('os');
// const { getAudioDurationInSeconds } = require('get-audio-duration')
// const { getVideoDurationInSeconds } = require('get-video-duration')
const { resolve } = require('path')
const {
    storage: { bucket, webUrlBase },
} = require('../configs/config')

// process.env.GOOGLE_APPLICATION_CREDENTIALS = 'configs/gcskeyfile.json'
// GOOGLE_APPLICATION_CREDENTIALS

module.exports.GCSAdapter = class {
    constructor(mediaUrlBase, options = {}) {
        this.mediaUrlBase = mediaUrlBase;
        this.originalFileName = options.originalFileName || '';
        this.newFilename = options.newFilename || '';
        this.id = options.id || '';

        // 判斷模式
        if (fs.existsSync(gcskeyfile)) {
            // GCS mode
            process.env.GOOGLE_APPLICATION_CREDENTIALS = path.resolve(gcskeyfile);
            this.storage = new Storage();
            this.bucket = this.storage.bucket(bucket);
            this.useLocal = false;
        } else {
            // local mode
            const homeDir = os.homedir();
            const localBaseDir = path.join(homeDir, 'Downloads', 'uploads');

            this.useLocal = true;
            this.localBaseDir = localBaseDir;
            // 確保資料夾存在
            if (!fs.existsSync(localBaseDir)) {
                fs.mkdirSync(localBaseDir, { recursive: true });
                console.log(`Created uploads directory at: ${localBaseDir}`);
            }
        }
    }


    getFilename({ id, originalFilename }) {
        // return `${id}-${originalFilename}`
        return `${id}${path.extname(originalFilename)}`;
    }

    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload
    // https://googleapis.dev/nodejs/storage/latest/File.html#createWriteStream
    async save({ stream, filename, mimetype, encoding, id }) {
        console.log('===save===')
        console.log('mimetype', mimetype)
        let _meta = {}

        const ext = path.extname(filename)
        const uploadedName = `${id}${ext}`

        if (this.useLocal) {
            // Local mode
            const localPath = path.join(this.localBaseDir, uploadedName)
            fs.mkdirSync(this.localBaseDir, { recursive: true })

            await new Promise((resolve, reject) => {
                const write = fs.createWriteStream(localPath)
                stream.pipe(write)
                write.on('finish', resolve)
                write.on('error', reject)
            })

            _meta.url = `file://${localPath}`
            _meta.mimeInfo = { contentType: mimetype }
        } else {
            // GCS mode
            const {
                file,
                baseName: uploadBaseName,
                uploadedName: gcsUploadedName,
            } = this.prepareUpload(filename, id)

            try {
                await this.uploadFile(stream, file, uploadBaseName)

                // 取得 metadata
                const mimeInfo = await file.getMetadata()
                _meta.mimeInfo = mimeInfo

                // URL
                _meta.url = this.publicUrl(gcsUploadedName)

                const tmpPath = `./${id}_tmp`
                if (fs.existsSync(tmpPath)) {
                    fs.unlink(tmpPath, (err) => {
                        if (err) console.error(err)
                        else console.log(`${tmpPath} deleted`)
                    })
                }
            } catch (err) {
                console.log(err.message)
                throw new Error("File upload failed, please try again.")
            }
        }

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
        const ext = path.extname(originalFilename); // 包含點號，如 ".mp4"
        const filename = `${id}${ext}`;

        if (this.useLocal) {
            const localPath = path.join(this.localBaseDir, filename);
            fs.unlink(localPath, (err) => {
                if (err) {
                    console.error(`Failed to delete local file: ${localPath}`, err);
                } else {
                    console.log(`Local file deleted: ${localPath}`);
                }
            });
            return;
        }

        // GCS 模式
        return new Promise(async (resolve, reject) => {
            console.log('===delete in gcs adapter===');
            const mediaDir = `${this.mediaUrlBase}${filename}`;
            try {
                await this.bucket.file(mediaDir).delete();
                console.log(`gs://${mediaDir} deleted.`);
                resolve();
            } catch (err) {
                console.log(err.message);
                reject(err);
            }
        });
    }

    async makePublic(filename) {
        // Makes the file public

        //await this.bucket.file(`${this.mediaUrlBase}{filename}`).makePublic()

        console.log(`gs://${filename} is now public.`)
    }

    publicUrl(filename) {
        if (this.useLocal) {
            return `file://${path.join(this.localBaseDir, filename)}`;
        }
        return `${webUrlBase}${this.mediaUrlBase}${filename}`;
    }
}
