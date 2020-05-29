/** @jsx jsx */
import { jsx } from '@emotion/core';
import { FieldContainer } from '@arch-ui/fields';
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import { handleDraftEditorPastedText } from "draftjs-conductor";
import { builtInButtons, customButtons } from './customToolbar';
import decorators from './editor/decorators'

import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const HtmlField = ({ onChange, autoFocus, field, value, errors }) => {
    const editorState = value ? value : EditorState.createEmpty();

    return (
        <FieldContainer >
            <Editor
                editorState={editorState}
                onEditorStateChange={onChange}
                handlePastedText={handlePastedText}
                toolbar={builtInButtons}
                toolbarCustomButtons={customButtons}
                customDecorators={decorators}
            />
        </FieldContainer>
    );
};

const handlePastedText = (text, html, editorState, onChange) => {
    let newEditorState = handleDraftEditorPastedText(html, editorState);
    if (newEditorState) {
        onChange(newEditorState);
        return true;
    }
    return false;
}

export default HtmlField;
