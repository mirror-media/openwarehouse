const { Text, Checkbox, Select, Relationship } = require('@keystonejs/fields');
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');
//const { File } = require('@keystonejs/fields');
//const GCSFile = require('../fields/GCSFile');

module.exports = {
    fields: {
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
}
