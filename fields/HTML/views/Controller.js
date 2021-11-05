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

    // when save post, format data from editorState to specified object, then return to db.
    serialize = (data) => {
        const editorStateInField = data[this.path]

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

// function addImageApiDataToEntityMap(editorState) {
//     const content = convertToRaw(editorState.getCurrentContent())
//     const { entityMap } = content
//     console.log(entityMap)

//     for (const index in entityMap) {
//         if (entityMap[index].type === 'IMAGE') {
//             const url = entityMap[index].data.url
//             console.log(url)
//         }
//     }

//     const newEditorState = convertFromRaw(content)
//     return newEditorState
// }

export default HtmlController
