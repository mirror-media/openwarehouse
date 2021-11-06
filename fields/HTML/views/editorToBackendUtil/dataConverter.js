import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import DraftConverter from './draft-converter'

export function convertDbDataToEditorState(storedContentBlock) {
    // convert saved editor content into the editor state
    let editorState
    try {
        const contentBlock = handleDraftData(storedContentBlock)

        if (contentBlock) {
            // create an EditorState from  contentBlock
            let contentState = convertFromRaw(contentBlock)
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
    const contentBlock = convertToRaw(editorState.getCurrentContent())

    // this is for some post migrated from readMe(which may have wrong inlineStyle)
    // remove unwanted undefined inlineStyle in here
    contentBlock.blocks.forEach((block) => {
        _.remove(block.inlineStyleRanges, (inlineStyleRange) => {
            return typeof inlineStyleRange.style === 'undefined'
        })
    })

    const html = DraftConverter.convertToHtml(contentBlock)
    const apiData = DraftConverter.convertToApiData(contentBlock)

    return {
        contentBlock,
        html,
        apiData,
    }
    // return content
}

function handleDraftData(data) {
    // NOTE: this is for some old post which is not just stored contentState only in db
    // it can be removed in the future
    if (data['draft']) {
        return data.draft
        // for new post, data = draft
    } else {
        return data
    }
}
