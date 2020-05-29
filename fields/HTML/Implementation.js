const { Text } = require('@keystonejs/fields');

class HtmlImplementation extends Text.implementation {
    constructor(path, { editorConfig }) {
        super(...arguments);
        this.editorConfig = editorConfig;
    }

    extendAdminMeta(meta) {
        return {
            ...meta,
            editorConfig: this.editorConfig,
        };
    }
}

module.exports = {
    Implementation: HtmlImplementation,
    MongoIntegerInterface: Text.adapters.mongoose,
    KnexIntegerInterface: Text.adapters.knex,
};