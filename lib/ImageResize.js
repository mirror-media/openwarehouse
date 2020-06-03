const im = require('imagemagick')
const resizeTarget = {
    tiny:{height:84, width:150},
    mobile:{height:450, width:800},
    tablet:{height:675, width:1200},
    desktop:{height:713, width:1268}
}
function get_ext(path){
    return new Promise((resolve, reject) => {
        im.identify(path, (err, feature) => {
            if (err) { return reject(err) }
            return resolve(feature.format)
        })
    })
}
async function resizeToSize(srcPath, size) {
    const options = {
        srcPath: srcPath,
        srcData: null,
        srcFormat: await get_ext(srcPath),
        dstPath: undefined,
        quality: 0.8,
        format: 'jpg',
        progressive: false,
        width: resizeTarget[size].width,
        height: resizeTarget[size].height,
        strip: true,
        filter: 'Lagrange',
        sharpening: 0.2,
        customArgs: []
    };
    im.resize(options, function(err, output) {
        if (err) throw err;
        console.log(output);
    });
}


async function resize4(srcPath){
    for (const key in resizeTarget){
        await resizeToSize(srcPath, resizeTarget[key])
    }
}


module.exports = resize4
