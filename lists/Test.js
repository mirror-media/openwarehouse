const { Text } = require('@keystonejs/fields');
const HTML = require('../fields/HTML');

module.exports = {
    fields: {
        name: { type: Text },
        brief: {
            type: HTML,
        },
    },
}
