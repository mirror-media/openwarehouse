const { Text, Checkbox, Select, Relationship, File, Slug } = require('@keystonejs/fields');
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { ImageAdapter } = require('../lib/ImageAdapter');
const path = require('path');
// const gcsDir = 'assets/images/'
const gcsDir = 'test_dir/'
const urlBase = `https://storage.cloud.google.com/mirrormedia-files/${gcsDir}`

// var gcskeyfile = require('../configs/gcskeyfile.json')
// gcskeyfile.bucket = 'mirrormedia-files'

module.exports = {
    fields: {
        file: {
            type: File,
            adapter: new ImageAdapter(gcsDir),
            // adapter: new S3Adapter(gcskeyfile),
            isRequired: true,
        },
        description: {
            type: Text
        },
        copyright: {
            label: '版權',
            type: Select,
            dataType: 'string',
            options: 'Creative-Commons, Copyrighted',
            defaultValue: 'Copyrighted'
        },


        watermark: {
            type: Checkbox,
            label: 'Needs Watermark?'
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
            label: '關鍵字',
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
        image: {
            type: Relationship, ref: 'GCSFile', many: false
        },
        // TODO: Not a field here
        urlDesktopSized: { type: Text, access: { read: false, create: true } },
        urlMobileSized: { type: Text, access: { read: false, create: true } },
        urlTabletSized: { type: Text, access: { read: false, create: true } },
        urlTinySized: { type: Text, access: { read: false, create: true } },
    },
    plugins: [
        // atTracking(),
        byTracking(),
    ],
    access: {
        update: access.userIsAboveAuthorOrOwner,
        create: access.userIsNotContributor,
        delete: access.userIsAboveAuthorOrOwner,
    },
    adminConfig: {
        defaultColumns: 'title, image, createdAt',
        defaultSort: '-createdAt',
    },

    hooks: {
        // Hooks for create and update operations
        resolveInput: ({ operation, existingItem, resolvedData, originalInput }) => {
            if (resolvedData.file) {
                resolvedData.urlDesktopSized = resolvedData.file._meta.url.urlDesktopSized
                resolvedData.urlMobileSized = resolvedData.file._meta.url.urlMobileSized
                resolvedData.urlTabletSized = resolvedData.file._meta.url.urlTabletSized
                resolvedData.urlTinySized = resolvedData.file._meta.url.urlTinySized
            }

            console.log("resolveInput RESOLVED DATA", resolvedData)
            return resolvedData
        },

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
