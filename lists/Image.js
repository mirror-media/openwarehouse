const { Text, Checkbox, Select, Relationship, File, Slug } = require('@keystonejs/fields');
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { GCSAdapter } = require('../lib/GCSAdapter');
const { S3Adapter } = require('@keystonejs/file-adapters');
// const gcsDir = 'assets/images/'
const gcsDir = 'test_dir/'
const path = require('path');
// var gcskeyfile = require('../configs/gcskeyfile.json')
// gcskeyfile.bucket = 'mirrormedia-files'


module.exports = {
    fields: {
        file: {
            type: File,
            adapter: new GCSAdapter(__dirname ,gcsDir),
            // adapter: new S3Adapter(gcskeyfile),
            isRequired: true,
        },
        description: {
            type: Text
        },
        copyright: {
            type: Select,
            dataType: 'string',
            options: 'Creative-Commons, Copyrighted',
            defaultValue: 'Copyrighted'
        },
        topics: {
            label: '專題',
            type: Relationship,
            ref: 'Topic'
        },
        tags: {
            label: '標籤',
            type: Relationship,
            ref: 'Tag',
            many: true
        },
        keywords: {
            type: Text,
        },
        createTime: {
            type: DateTimeUtc,
            defaultValue: new Date()
        },
        sale: {
            type: Checkbox
        },
        //TODO: this is not right
        image:{
            type:Relationship, ref:'GCSFile', many: false
        },
        // TODO: Not a field here
        urlDesktopSized:{type:Text, access:{read:false, write:false}},
        urlMobileSized:{type:Text, access:{read:false, write:false}},
        urlTabletSized:{type:Text, access:{read:false, write:false}},
        urlTinySized:{type:Text, access:{read:false, write:false}},
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    adminConfig: {
        defaultColumns: 'description',//, image',
        defaultSort: '-createTime',
    },

    hooks:{
        // Hooks for create and update operations
        resolveInput: async ({ operation, existingItem, resolvedData }) => {console.log("resolved data id:",resolvedData.id)}

        // validateInput: async (...) => {...}
        // beforeChange: async ({ existingItem }) => {
        //     if (existingItem && existingItem.file) {
        //         await GCSAdapter.deleteFile(existingItem.file)
        //     }
        // }
        // afterChange: async (...) => {...}

        // Hooks for delete operations
        // validateDelete: async (...) => {...}
        // beforeDelete: async (...) => {...}
        // afterDelete: async ({ existingItem }) => {
        //     if (existingItem.file) {
        //         await fileAdapter.delete(existingItem.file);
        //     }
        // }
    }
}
