import FieldController from '@keystonejs/fields/Controller'
import {
    convertDbDataToEditorState,
    convertEditorStateToDbData,
} from './editorToBackendUtil/dataConverter'
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'

// controller defines how front-end features work
class HtmlController extends FieldController {
    constructor(config, ...args) {
        super(config, ...args)
    }

    // when save post, format data from editorState to specified object:
    // {
    //     draft (contentBlock),
    //     apiData,
    //     html,
    // }
    //  this object will stored in resolvedData and run through list.hooks
    serialize = (data) => {
        const editorStateInField = data[this.path]
        console.log(this.path)

        if (editorStateInField) {
            console.log(
                JSON.stringify(convertEditorStateToDbData(editorStateInField))
            )
        }

        return editorStateInField
            ? JSON.stringify(convertEditorStateToDbData(editorStateInField))
            : undefined
    }

    // when load post, format data from db object to editorState, then return to editor.
    deserialize = (data) => {
        return convertDbDataToEditorState(
            data[this.path] ? JSON.parse(data[this.path]) : undefined
        )
    }

    getFilterTypes = () => []
}

export default HtmlController
