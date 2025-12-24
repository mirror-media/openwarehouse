const { Text, Url, Select, Integer } = require('@keystonejs/fields')
const { gql } = require('apollo-server-express')

const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    moderator,
    editor,
    bot,
    allowRoles,
} = require('../../helpers/access/mirror-tv')

const cacheHint = require('../../helpers/cacheHint')
const { cronService } = require('../../configs/config.js')

module.exports = {
    fields: {
        name: {
            label: '影片名稱',
            type: Text,
            isRequired: true,
        },
        sortOrder: {
            label: '排序順位',
            type: Integer,
            isUnique: true,
        },
        ytUrl: {
            label: 'Youtube影片',
            type: Url,
            isRequired: true,
        },
        state: {
            label: '狀態',
            type: Select,
            options: 'draft, published, scheduled',
            defaultValue: 'draft',
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
        defaultColumns: 'name, sortOrder, state',
        defaultSort: '-sortOrder',
    },
    hooks: {
        afterChange: async ({ existingItem, updatedItem }) => {
            const wasPublished = existingItem?.state === 'published'
            const isPublished = updatedItem.state === 'published'
            if (wasPublished || isPublished) {
                console.log(
                    `[Hook] PromotionVideo "${updatedItem.name}" published status changed, triggering JSON regeneration`
                )

                try {
                    const fetch = require('node-fetch')
                    const CRON_SERVICE_URL =
                        cronService.apiUrlBase || 'http://localhost:5000'

                    console.log(
                        `[Hook] Calling ${CRON_SERVICE_URL}/homepage_video`
                    )

                    const response = await fetch(
                        `${CRON_SERVICE_URL}/homepage_video`,
                        {
                            method: 'GET',
                        }
                    )

                    if (response.ok) {
                        console.log(
                            '[Hook] Video JSON updated successfully via PromotionVideo'
                        )
                    } else {
                        console.error(
                            '[Hook] Video JSON update failed:',
                            response.status,
                            response.statusText
                        )
                    }
                } catch (error) {
                    console.error(
                        '[Hook] Failed to trigger video JSON update:',
                        error.message
                    )
                }
            }
        },
    },
    labelField: 'name',
    cacheHint: cacheHint,
}
