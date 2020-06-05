const { Storage } = require('@google-cloud/storage');
const urlJoin = require('url-join');
const path = require('path')
const gcskeyfile = './configs/gcskeyfile.json';

// process.env.GOOGLE_APPLICATION_CREDENTIALS = 'configs/gcskeyfile.json'
// GOOGLE_APPLICATION_CREDENTIALS

module.exports.GCSAdapter = class {
    constructor(src, gcsDir, gcskeyfilePath = gcskeyfile) {
        gcskeyfilePath = path.resolve(gcskeyfile)
        if (!gcskeyfilePath) {
            throw new Error('GCSAdapter needs you specifies GOOGLE_APPLICATION_CREDENTIALS, should be a string path')
        }
        process.env.GOOGLE_APPLICATION_CREDENTIALS = gcskeyfilePath
        this.src = path.resolve(src)
        console.log("This src: ", this.src)
        this.storage = new Storage()
        this.bucket = this.storage.bucket('mirrormedia-files')
        this.gcsDir = gcsDir
    }

    getFilename({ id, originalFilename }) {
        return `${id}-${originalFilename}`;
    }

    // https://googleapis.dev/nodejs/storage/latest/Bucket.html#upload
    async save({ stream, filename, mimetype, encoding, id }) {
        console.log("THE ID: ", id)
        console.log("Current adapter:", this.src)  // /Users/andy/mirror/crapstone/lists
        // return new Promise((resolve, reject) => {
        const src_name = path.resolve(path.relative(this.src, path.resolve(filename)))

        console.log("Got :", src_name)  // The path js think it is : /Users/andy/mirror/WHO.jpeg        // WRONG!!!
        console.log("file path:" , path.resolve(filename))  // /Users/andy/mirror/crapstone/WHO.jpeg    // WRONG!!!
        const baseName = path.basename(src_name)
        try {
            const fulfilled = this.bucket.upload(src_name, this.getOptions(baseName), (err, file) => {
                if (err) { console.log(err) };
                console.log("RRRRRR:", file)
            })
        }
        catch (err) { console.log(err) }
        // })

        // --------------------------------
        // Uploads a local file to the bucket
        // const baseName = Path.basename(filename)
        // await this.bucket.upload(filename, this.getOptions(filename=baseName));
        // console.log(`${baseName} uploaded.`)
    }

    getOptions(filename) {
        let destination = `${this.gcsDir}${filename}`;
        console.log("UPLOAD TO destination: " + destination)
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

        // console.log(`gs://${filename} is now public.`);
    }

    PublicUrl(filename) {
        let s = `https://storage.googleapis.com/${this.bucket}/${filename}`
        return s
    }
}


