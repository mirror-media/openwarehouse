//  provides the main interface used
// when creating or editing list items in Keystone.

/** @jsx jsx */

import { jsx } from '@emotion/core'
import { FieldContainer, FieldLabel, FieldInput } from '@arch-ui/fields'
import NewDateTime from './NewDateTime'

const NewDateTimeField = ({ field, value, errors, onChange }) => {
    return (
        <FieldContainer>
            <FieldLabel
                htmlFor={`ks-input-${field.path}`}
                field={field}
                errors={errors}
            />
            <FieldInput>
                <NewDateTime
                    value={value}
                    onChange={onChange}
                    config={field.config}
                    isReadOnly={field.isReadOnly}
                />
            </FieldInput>
        </FieldContainer>
    )
}
export default NewDateTimeField
