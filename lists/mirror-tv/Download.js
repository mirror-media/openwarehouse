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
module.exports = {
    fields: {
        name: {
            label: '標題',
            type: Text,
            isRequired: true,
        },
        file: {
            label: '檔案(支援檔案類型:PDF word excel ppt)',
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

        afterChange: async ({
            operation,
            updatedItem,
            originalInput,
            context,
        }) => {
            // 只處理 tv-schedule 的 create 和 update
            if (updatedItem.name !== 'tv-schedule') return
            const isFileUpload = originalInput && originalInput.file
            if (
                operation === 'create' ||
                (operation === 'update' && isFileUpload)
            ) {
                const filename = updatedItem.file
                    ? updatedItem.file.filename
                    : null
                if (!filename || !filename.endsWith('.csv')) return
                try {
                    const fetch = require('node-fetch')
                    const CRON_SERVICE_URL =
                        cronService.apiUrlBase || 'http://localhost:5000'
                    const syncUrl = `${CRON_SERVICE_URL}/tv-schedule/sync`
                    const blobName = `${mediaUrlBase}${filename}`
                    console.log(
                        `[Download Hook] Triggering tv-schedule sync for: ${blobName}`
                    )
                    const response = await fetch(syncUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filename: blobName }),
                    })
                    if (response.ok) {
                        const result = await response.json()
                        if (result.url) {
                            // 執行更新
                            await context.executeGraphQL({
                                query: `
                                    mutation updateDownloadUrl($id: ID!, $url: String!) {
                                        updateDownload(id: $id, data: { url: $url }) {
                                            id
                                        }
                                    }
                                `,
                                variables: {
                                    id: updatedItem.id,
                                    url: result.url,
                                },
                            })
                            console.log(
                                `[K5 Hook] URL updated to: ${result.url}`
                            )
                        }
                    }
                } catch (error) {
                    console.error('[K5 Hook] Sync Error:', error.message)
                }
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
