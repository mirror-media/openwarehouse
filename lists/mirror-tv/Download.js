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
const { cronService } = require('../../configs/config.js')
const { storage } = require('../../configs/config.js')
module.exports = {
    fields: {
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        file: {
            label: '檔案(支援檔案類型:PDF word excel ppt csv)',
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
        update: allowRoles(admin, moderator, editor, bot),
        create: allowRoles(admin, moderator, editor),
        delete: allowRoles(admin, moderator),
    },
    adminConfig: {
        defaultColumns: 'name, url, createdAt',
        defaultSort: '-createdAt',
    },
    hooks: {
        resolveInput: ({ resolvedData, existingItem }) => {
            if (resolvedData.file) {
                resolvedData.url = resolvedData.file._meta.url
            }
            if (
                resolvedData.name === 'tv-schedule' ||
                existingItem?.name === 'tv-schedule'
            ) {
                const bucketUrl = storage.gcpUrlBase
                resolvedData.url = `${bucketUrl}json/tv-schedule.json`
                console.log(
                    '[Download resolveInput] Set tv-schedule URL to:',
                    resolvedData.url
                )
            }
            return resolvedData
        },

        afterChange: async ({ operation, updatedItem, originalInput }) => {
            // 只處理 tv-schedule
            if (updatedItem.name !== 'tv-schedule') return
            const isFileUpload = originalInput && originalInput.file
            const isCreate = operation === 'create'
            if (!isCreate && !isFileUpload) return

            const file = updatedItem.file
            if (!file || !file._meta || !file._meta.url) {
                console.log('[Download Hook] No file URL found')
                return
            }

            const csvUrl = file._meta.url
            if (!csvUrl.endsWith('.csv')) {
                console.log('[Download Hook] Not a CSV file')
                return
            }

            const match = csvUrl.match(/(assets\/documents\/.+\.csv)/)
            const blobName = match ? match[1] : null
            if (!blobName) {
                console.error(
                    '[Download Hook] Cannot extract blob name from:',
                    csvUrl
                )
                return
            }

            console.log(`[Download Hook] Blob name: ${blobName}`)
            try {
                const fetch = require('node-fetch')
                const CRON_SERVICE_URL =
                    cronService.apiUrlBase || 'http://localhost:5000'
                const syncUrl = `${CRON_SERVICE_URL}/tv-schedule/sync`
                console.log(`[Download Hook] Triggering tv-schedule sync`)
                const response = await fetch(syncUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        filename: blobName,
                    }),
                })
                if (!response.ok) {
                    console.error(
                        `[Download Hook] Sync failed: ${response.status}`
                    )
                } else {
                    const result = await response.json()
                    console.log(
                        '[Download Hook] Sync triggered successfully:',
                        result
                    )
                }
            } catch (error) {
                console.error('[K5 Hook] Sync Error:', error.message)
            }
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
