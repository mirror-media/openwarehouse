const {Storage} = require('@google-cloud/storage');
const urlJoin = require('url-join');
const Path = require('path')

// process.env.GOOGLE_APPLICATION_CREDENTIALS = 'configs/gcskeyfile.json'
// GOOGLE_APPLICATION_CREDENTIALS

module.exports.GCSAdapter = class {
    constructor(gcsDir, gcskeyfilePath='../configs/gcskeyfile.json') {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = gcskeyfilePath
        this.storage = new Storage()
        this.bucket = this.storage.bucket('mirrormedia-files')
        this.gcsDir = gcsDir
    }

    async uploadFile(filename) {
        // Uploads a local file to the bucket
        const baseName = Path.basename(filename)
        await this.bucket.upload(filename, this.getOptions(filename=baseName));

        console.log(`${baseName} uploaded.`)
    }

    getOptions(filename) {
        let destination = `${this.gcsDir}${filename}`;
        console.log(destination)
        let options = {
            // Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,
            // By setting the option `destination`, you can change the name of the
            // object you are uploading to a bucket.
            destination: destination,
            metadata: {
                // Enable long-lived HTTP caching headers
                // Use only if the contents of the file will never change
                // (If the contents will change, use cacheControl: 'no-cache')
                cacheControl: 'public, max-age=31536000',
            },
        };


        return options
    }

    async deleteFile(filename) {
        await this.bucket.file(filename).delete();

        console.log(`gs://${this.gcsDir}${filename} deleted.`);
    }

    async makePublic(filename) {
    // Makes the file public
        await this.bucket.file(`${this.gcsDir}{filename}`).makePublic();

        console.log(`gs://${filename} is now public.`);
    }

    PublicUrl(filename) {
        let s = `https://storage.googleapis.com/${this.bucket}/${filename}`
        return s
    }
}


