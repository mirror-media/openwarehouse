const { Text, Relationship } = require('@keystonejs/fields');
const { DateTimeUtc } = require('@keystonejs/fields-datetime-utc');
const { atTracking, byTracking } = require('@keystonejs/list-plugins');

module.exports = {
    fields: {
        title: {
            type: Text,
            isRequired: true
        },
        //description: { type: Types.Html, wysiwyg: true, height: 150 },
        /*audio: {
            type: Types.GcsFile,
            initial: true,
            autoCleanup: true,
            datePrefix: 'YYYYMMDDHHmmss',
            bucket: bucket,
            destination: 'assets/audios/',
            publicRead: true,
        },*/
        //coverPhoto: { type: Types.ImageRelationship, ref: 'Image' },
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
    plural: 'Audios'
}
