'use strict';

const {GCSAdapter} = require('./GCSAdapter.js')
const im = require('imagemagick-stream');
const path = require('path');

const resizeTarget = {
    tiny: { height: 84, width: 150 },
    mobile: { height: 450, width: 800 },
    tablet: { height: 675, width: 1200 },
    desktop: { height: 713, width: 1268 }
}


class ImageAdapter extends GCSAdapter {
    
    async save({ stream, filename, mimetype, encoding, id }) {
        const baseName = path.basename(filename)
        

        try {
            for (const key in resizeTarget) {
                const resized_filename = `${key}-${baseName}`
                const file = this.bucket.file(`${this.gcsDir}${resized_filename}`) //get the upload path
                const write = file.createWriteStream(this.getOptions(resized_filename));
                
                stream.pipe( im().resize( `${resizeTarget[key].width}x${resizeTarget[key].height}` ) ).pipe( write ) //resize and upload
            }

        }
        catch (err) { console.log(err) }
        return { id, filename, mimetype }
    }

    delete(file) {

    }
}


module.exports = {ImageAdapter}