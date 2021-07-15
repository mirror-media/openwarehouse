const {
    Checkbox,
    Relationship,
    Select,
    Text,
    Url,
} = require('@keystonejs/fields')
const NewDateTime = require('../../fields/NewDateTime/index.js')

const { byTracking } = require('@keystonejs/list-plugins')
const { atTracking } = require('../../helpers/list-plugins')
const {
    admin,
    moderator,
    editor,
    contributor,
    owner,
    allowRoles,
} = require('../../helpers/access/mirror-tv')
const cacheHint = require('../../helpers/cacheHint')

module.exports = {
    fields: {
        name: {
            label: '時段名稱',
            type: Text,
            isRequired: true,
        },
        monday: {
            label: '週一',
            type: Checkbox,
            isRequired: true,
        },
        tuesday: {
            label: '週二',
            type: Checkbox,
            isRequired: true,
        },
        wednesday: {
            label: '週三',
            type: Checkbox,
            isRequired: true,
        },
        thursday: {
            label: '週四',
            type: Checkbox,
            isRequired: true,
        },
        friday: {
            label: '週五',
            type: Checkbox,
            isRequired: true,
        },
        saturday: {
            label: '週六',
            type: Checkbox,
            isRequired: true,
        },
        sunday: {
            label: '週日',
            type: Checkbox,
            isRequired: true,
        },
        hour: {
            label: '時',
            dataType: 'string',
            type: Select,
            isRequired: true,
            options: [...Array(24).keys()].map((v) =>
                v.toString().padStart(2, 0)
            ),
        },
        minute: {
            label: '分',
            dataType: 'string',
            type: Select,
            isRequired: true,
            options: [...Array(60).keys()].map((v) =>
                v.toString().padStart(2, 0)
            ),
        },
        parentalGuidelines: {
            label: '電視節目分級',
            dataType: 'string',
            type: Select,
            isRequired: true,
            options: ['普遍級', '保護級'],
        },
        replay: {
            label: '重播',
            type: Checkbox,
        },
        showUrl: {
            label: '節目連結',
            type: Relationship,
            ref: 'Show',
            many: false,
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
    hooks: {},
    cacheHint: cacheHint,
    labelField: 'name',
}
