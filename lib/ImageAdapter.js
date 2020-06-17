const { GCSAdapter } = require('./GCSAdapter.js')
const im = require('imagemagick-stream');
const path = require('path');
const fs = require('fs');
const moment = require('moment')
const { addWatermark } = require('../lib/watermark.js')
const extractIPTC = require('../lib/extractIPTC')
const urlBase = 'https://storage.cloud.google.com/mirrormedia-files/'


const resizeTarget = {
    tiny: { height: 84, width: 150 },
    mobile: { height: 450, width: 800 },
    tablet: { height: 675, width: 1200 },
    desktop: { height: 713, width: 1268 }
}


class ImageAdapter extends GCSAdapter {

    async save({ stream, filename, mimetype, encoding, id }) {
        const baseName = path.basename(filename)
        const nowtime = moment(new Date()).format("YYYYMMDDhhmmss");

        let ext = baseName.split(".")[1]
        console.log("GOT FILENAME:", filename) // This happened before hook resolveInput

        stream.pipe(fs.createWriteStream("./server_local_tmp.jpg"))

        // addWatermark('./server_local_tmp.jpg')
        console.log("SAVED A LOCAL TEMP AT SERVER")

        var url = {}
        //Save to GCS
        try {
            for (const key in resizeTarget) {
                const resized_filename = `${nowtime}-${id}-${key}.${ext}`

                switch (key) {
                    case 'tiny':
                        url.urlTinySized = `${urlBase}${this.gcsDir}${resized_filename}`
                    case 'mobile':
                        url.urlMobileSized = `${urlBase}${this.gcsDir}${resized_filename}`
                    case 'tablet':
                        url.urlTabletSized = `${urlBase}${this.gcsDir}${resized_filename}`
                    case 'desktop':
                        url.urlDesktopSized = `${urlBase}${this.gcsDir}${resized_filename}`
                }

                
                const file = this.bucket.file(`${this.gcsDir}${resized_filename}`) //get the upload path
                const write = file.createWriteStream(this.getOptions(resized_filename));
                
                // const metadata = this.getMeta(`${this.gcsDir}${resized_filename}`)
                stream.pipe(im().resize(`${resizeTarget[key].width}x${resizeTarget[key].height}`)).pipe(write) //resize and upload
                console.log(`${resized_filename} SAVE TO GCS COMPLETED`)

            }
        }
        catch (err) { console.log(err) }
        var _meta = {}
        _meta.url = url
        console.log(url)
        
        return { id, filename, _meta }
    }

    delete(file) {

    }

    async getMeta(path){
        const [meta] = await this.bucket.file(path).getMetadata() //this bucket is not a function
        return meta
    }

    PublicUrl(filename) {
        let s = `https://storage.googleapis.com/${this.bucket}/${filename}`
        return s
    }
}


module.exports = { ImageAdapter }