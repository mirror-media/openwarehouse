const { Text, Relationship, File } = require('@keystonejs/fields');
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
const { GCSAdapter } = require('../lib/GCSAdapter');
const access = require('../helpers/access');
const gcsDir = 'assets/audios/'

module.exports = {
    fields: {
        file: {
            type: File,
            adapter: new GCSAdapter(gcsDir),
            isRequired: true,
        },
        title: {
            label: '標題',
            type: Text,
            isRequired: true
        },
        tags: {
            label: '標籤',
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
        },

        coverPhoto:{
            type:Relationship, ref:'Image', many: false
        },

        mimeInfo:{
            type: Text, access:{read:false, write:false}
        }

    },
    plugins: [
        atTracking(),
        byTracking(),
    ],
    access: {
        update: access.userIsAboveAuthorOrOwner,
        create: access.userIsNotContributor,
        delete: access.userIsAboveAuthorOrOwner,
    },
    adminConfig: {
        defaultColumns: 'title, audio, tags, createdAt',
        defaultSort: '-createdAt',
    },
    plural: 'Audios',

    hooks:{
        // Hooks for create and update operations
        resolveInput: async ({ operation, existingItem, resolvedData, originalInput }) => {
            console.log("RESLVED INPUT", resolvedData)
            return resolvedData
        }
        // validateInput: async (...) => {...}
        // beforeChange: async (...) => {...}
        // afterChange: async (...) => {...}

        // Hooks for delete operations
        // validateDelete: async (...) => {...}
        // beforeDelete: async (...) => {...}
        // afterDelete: async (...) => {...}
    }
}
