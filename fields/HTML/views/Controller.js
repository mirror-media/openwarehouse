import FieldController from '@keystonejs/fields/Controller';
import { convertToEditorState, fetchData } from './dataConverter';
import { createEditorStateFromRaw, serialiseEditorStateToRaw } from "draftjs-conductor";

class HtmlController extends FieldController {
    constructor(config, ...args) {
        super(config, ...args);
    }

    serialize = data => {
        return data[this.path] ? JSON.stringify(serialiseEditorStateToRaw(data[this.path])) : undefined;
    };

    deserialize = data => {
        return createEditorStateFromRaw(data[this.path] ? JSON.parse(data[this.path]) : undefined);
    };

    getFilterTypes = () => [];
}

export default HtmlController;
