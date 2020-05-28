const {Storage} = require('@google-cloud/storage');
const urlJoin = require('url-join');
const Path = require('path')

// process.env.GOOGLE_APPLICATION_CREDENTIALS = 'configs/gcskeyfile.json'
// GOOGLE_APPLICATION_CREDENTIALS

module.exports = class GCSAdapter {
    constructor(gcskeyfilePath) {
        process.env.GOOGLE_APPLICATION_CREDENTIALS = gcskeyfilePath;
        this.storage = new Storage();
        this.bucket = this.storage.bucket('mirrormedia-files');
    }
// {
//     destination?: string | File;
//     encryptionKey?: string | Buffer;
//     kmsKeyName?: string;
//     resumable?: boolean;
//     onUploadProgress?: (progressEvent: any) => void;
// }
    async uploadFile(filename, gcsDir='') {
        // Uploads a local file to the bucket
        const baseName = Path.basename(filename)
        await this.bucket.upload(filename, this.getOptions(filename=baseName, gcsDir=''));

        console.log(`${baseName} uploaded.`);
    }

    getOptions(filename,gcsDir='') {
        return {
            // Support for HTTP requests made with `Accept-Encoding: gzip`
            gzip: true,
            // By setting the option `destination`, you can change the name of the
            // object you are uploading to a bucket.
            destination: `${gcsDir}${filename}`,
            metadata: {
                // Enable long-lived HTTP caching headers
                // Use only if the contents of the file will never change
                // (If the contents will change, use cacheControl: 'no-cache')
                cacheControl: 'public, max-age=31536000',
            },
        };
    }

    async deleteFile(filename) {
        await this.bucket.file(filename).delete();

        console.log(`gs://${filename} deleted.`);
    }

    async makePublic(filename) {
    // Makes the file public
        await this.bucket.file(filename).makePublic();

        console.log(`gs://${filename} is now public.`);
    }

    PublicUrl(filename) {
        let s = `https://storage.googleapis.com/${this.bucket}/${filename}`;
        return s;
    }
}


