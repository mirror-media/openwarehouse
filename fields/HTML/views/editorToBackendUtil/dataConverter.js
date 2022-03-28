import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import DraftConverter from './draft-converter'

export function convertDbDataToEditorState(data) {
    // convert saved editor content into the editor state
    let editorState
    try {
        const draft = handleDraftData(data)

        if (draft) {
            // create an EditorState from the raw Draft data
            let contentState = convertFromRaw(draft)
            editorState = EditorState.createWithContent(contentState)
        } else {
            // create empty draft object
            editorState = EditorState.createEmpty()
        }
    } catch (error) {
        // create empty EditorState
        editorState = EditorState.createEmpty()
    }

    return editorState
}

export function convertEditorStateToDbData(editorState) {
    try {
        const content = convertToRaw(editorState.getCurrentContent())

        // remove unwanted undefined inlineStyle
        content.blocks.forEach((block) => {
            _.remove(block.inlineStyleRanges, (inlineStyleRange) => {
                return typeof inlineStyleRange.style === 'undefined'
            })
        })
    
        const cHtml = DraftConverter.convertToHtml(content)
        const apiData = DraftConverter.convertToApiData(content)

        console.log('DraftConverter', DraftConverter)
        console.log('dataconverter', {
            draft: content,
            html: cHtml,
            apiData,
        })
    
        return {
            draft: content,
            html: cHtml,
            apiData,
        }
    } catch (err) {
      console.log('[error]', err)
      return {
        draft: null,
        html: '',
        apiData: '',
      }
    }
    // return content
}

function handleDraftData(data) {
    if (data['draft']) {
        return data.draft
        // for new post, data = draft
    } else {
        return data
    }
}
