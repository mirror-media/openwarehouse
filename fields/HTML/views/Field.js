import React, { useState } from 'react'
import { FieldContainer, FieldLabel, FieldDescription } from '@arch-ui/fields'
import HtmlDraftEditor from '@mirrormedia/html-draft-editor'
import DraftEditor from './Editor'

const HtmlField = ({ onChange, autoFocus, field, value, errors }) => {
    // NOTE: k5 can't use optional chaining......
    const { editorConfig } = field.config || {}
    const { blocktypes, inlineStyles, entityList, isReadOnly } =
        editorConfig || {}

    return (
        <FieldContainer>
            <div
                className="editorContainer"
                style={{
                    border: '1px solid #C1C7D0',
                    borderRadius: 6,
                    padding: '2px',
                }}
            >
                <FieldLabel field={field} errors={errors} />
                <FieldDescription text={field.adminDoc} />

                <HtmlDraftEditor
                    KeyStoneOnChange={onChange}
                    autoFocus={autoFocus}
                    field={field}
                    value={value}
                    customBlocktypes={blocktypes}
                    customInlineStyles={inlineStyles}
                    customEntityList={entityList}
                    globalReadOnly={isReadOnly}
                />
                {/* <DraftEditor value={value} onChange={onChange} /> */}
            </div>
        </FieldContainer>
    )
}

export default HtmlField
