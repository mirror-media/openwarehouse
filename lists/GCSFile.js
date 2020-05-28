const { Text, Integer } = require('@keystonejs/fields');

module.exports = {
    fields:{
        fileName:{type: Text},
        fileType:{type: Integer},
        gcsBucket:{type: Text},
        gcsDir:{type:Text},
        size:{type:Integer},
        url:{type:Integer},
        height:{type:Integer},
        width:{type:Integer},
        iptc:{type:Text},
        urlDesktopSized:{type:Text},
        urlMobileSized:{type:Text},
        urlTabletSized:{type:Text},
        urlTinySized:{type:Text},
    }
}
