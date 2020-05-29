const { Text, Relationship, FIle } = require('@keystonejs/fields');
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { GCSAdapter } = require('../lib/GCSAdapter');
const gcsDir = 'assets/audios/'

module.exports = {
    fields: {
        file: {
            type: File,
            adapter: new GCSAdapter(gcsDir=gcsDir),
            isRequired: true,
        },
        title: {
            type: Text,
            isRequired: true
        },

        tags: {
            type: Relationship,
            ref: 'Tag',
            many: true
        },
        createTime: {
            type: DateTimeUtc,
            defaultValue: new Date()
        },
        audio:{
            type:Relationship, ref:'GCSFile', many: false
        }
    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    adminConfig: {
        defaultColumns: 'title, audio, tags',
        defaultSort: '-createTime',
    },
    plural: 'Audios',

    hooks:{
        // Hooks for create and update operations
        // resolveInput: async (...) => {...}
        // validateInput: async (...) => {...}
        // beforeChange: async (...) => {...}
        // afterChange: async (...) => {...}

        // Hooks for delete operations
        // validateDelete: async (...) => {...}
        // beforeDelete: async (...) => {...}
        // afterDelete: async (...) => {...}
    }
}
