import { EditorState, convertFromRaw, convertToRaw } from 'draft-js';
import DraftConverter from './K3/draft-converter';

export function convertToEditorState(data) {

    // convert saved editor content into the editor state
    let editorState;
    try {
        const { draft, html } = data;
        if (draft && html !== '') {
            // create an EditorState from the raw Draft data
            let contentState = convertFromRaw(draft);
            editorState = EditorState.createWithContent(contentState);
        } else {
            // create empty draft object
            editorState = EditorState.createEmpty();
        }
    }
    catch (error) {
        // create empty EditorState
        editorState = EditorState.createEmpty();
    }

    return editorState;
}

export function fetchData(editorState) {
    const content = convertToRaw(editorState.getCurrentContent());
    const cHtml = DraftConverter.convertToHtml(content);
    const apiData = DraftConverter.convertToApiData(content);

    return {
        draft: content,
        html: cHtml,
        apiData,
    };
}