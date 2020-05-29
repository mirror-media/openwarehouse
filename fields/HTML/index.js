const { Text } = require('@keystonejs/fields');
const { importView } = require('@keystonejs/build-field-types');
const { Implementation, MongoIntegerInterface, KnexIntegerInterface } = require('./Implementation');


module.exports = {
    type: 'HTML',
    implementation: Implementation,
    views: {
        Controller: require.resolve('./views/Controller'),
        Field: importView('./views/Field'),
        Cell: require.resolve('./views/Cell'),
        Filter: Text.views.Filter,
    },
    adapters: {
        mongoose: MongoIntegerInterface,
        knex: KnexIntegerInterface,
    },
};
