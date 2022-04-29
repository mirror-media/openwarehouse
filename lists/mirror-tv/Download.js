const { Text, File } = require('@keystonejs/fields')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const { DocumentAdapter } = require('../../lib/DocumentAdapter')
const {
    admin,
    bot,
    moderator,
    editor,
    contributor,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')
const { deleteOldFileInGCS } = require('../../utils/gcsHandler')
const { text } = require('express')
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
            label:'檔案(支援檔案類型:PDF word excel ppt)',
            type: File,
            adapter: fileAdapter,
        },
        url: {
            label: 'URL',
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
        update: allowRoles(admin, moderator, editor),
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin, moderator),
    },
    adminConfig: {
        defaultColumns: 'name, url, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        resolveInput: ({ resolvedData }) => {
            if (resolvedData.file) {
                resolvedData.url = resolvedData.file._meta.url
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
    plural: 'Downloads',
    labelField: 'name',
    cacheHint: cacheHint,
}
