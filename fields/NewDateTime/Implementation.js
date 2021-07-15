const { Text, DateTime } = require('@keystonejs/fields')

class NewDateTime extends DateTime.implementation {
    constructor(path, { newDateTime }) {
        super(...arguments)
        this.newDateTime = newDateTime
    }

    extendAdminMeta(meta) {
        return {
            ...meta,
            hasNowBtn: this.config.hasNowBtn || false,
            isReadOnly: this.config.isReadOnly || false,
        }
    }
}

module.exports = {
    NewDateTime,
    // define how a queries and mutations
    // should be translated into SQL or MongoDB actions
    // (we're just going to going to re-export the adapters for the Integer field)
    MongoIntegerInterface: DateTime.adapters.mongoose,
    KnexIntegerInterface: DateTime.adapters.knex,
}
