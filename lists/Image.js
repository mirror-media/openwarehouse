const { Text, Checkbox, Select, Relationship, File } = require('@keystonejs/fields');
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { GCSAdapter } = require('../lib/GCSAdapter');
const gcsDir = 'assets/images/'

module.exports = {
    fields: {
        file: {
            type: File,
            adapter: new GCSAdapter(gcsDir),
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
        image:{
            type:Relationship, ref:'GCSFile', many: false
        }
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    adminConfig: {
        defaultColumns: 'description',//, image',
        defaultSort: '-createTime',
    },

    // hooks:{
        // Hooks for create and update operations
        // resolveInput: async ({ operation, existingItem, resolvedData }) => {console.log(resolvedData)}

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
    // }
}
