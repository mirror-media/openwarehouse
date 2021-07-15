const { Text, Relationship, File, Url, Integer } = require('@keystonejs/fields')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const { DocumentAdapter } = require('../../lib/DocumentAdapter')
const {
    admin,
    moderator,
    editor,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')
const { deleteOldFileInGCS } = require('../../utils/gcsHandler')

const mediaUrlBase = 'assets/documents/'
const fileAdapter = new DocumentAdapter(mediaUrlBase)

module.exports = {
    fields: {
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        file: {
            type: File,
            adapter: fileAdapter,
            // isRequired: true,
        },
        pdfUrl: {
            label: 'PDF網址',
            type: Text,
            adminConfig: {
                isReadOnly: true,
            },
        },
    },
    plugins: [
        atTracking({
            hasNowBtn: false,
            isReadOnly: true,
        }),
        byTracking(),
    ],
    access: {
        update: allowRoles(admin, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    hooks: {
        resolveInput: ({ resolvedData }) => {
            if (resolvedData.file) {
                resolvedData.pdfUrl = resolvedData.file._meta.url
            }
            return resolvedData
        },
        afterDelete: async ({ existingItem }) => {
            try {
                deleteOldFileInGCS(existingItem, fileAdapter)
            } catch (err) {
                console.log(err)
            }
        },
    },
    adminConfig: {
        // defaultColumns: 'schedule, time, updatedAt',
        // defaultSort: '-updatedAt',
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
