const { Text } = require('@keystonejs/fields')
const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    moderator,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')

module.exports = {
    fields: {
        dataSourceName: {
            label: '資料名稱',
            type: Text,
        },
        url: {
            label: '連結',
            type: Text,
        },
    },
    plugins: [atTracking(), byTracking()],
    access: {
        update: allowRoles(admin, moderator),
        create: allowRoles(admin, moderator),
        delete: allowRoles(admin),
    },
    adminConfig: {
        defaultColumns: 'dataSourceName, url, createdAt',
        defaultSort: '-createdAt',
    },
    labelField: 'dataSourceName',
    cacheHint: cacheHint,
}
