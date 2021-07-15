import React, { useState } from 'react'
import './NewDateTime.style.css'
import Datetime from 'react-datetime'
import 'react-datetime/css/react-datetime.css'
import './DateFormat'

function NewDateTime({ value, onChange, config, isReadOnly }) {
    // react-datetime accept integer unix timestamp
    // transform ISO 8601 to unix timestamp
    const newValue = Date.parse(value)

    const [inputField, setInputField] = useState(newValue)

    // get selected unix timestamp by moment from callback
    const changeHandler = (momentObj) => {
        let edittedMomentObj = momentObj

        // when user edit field's content by keyboard
        if (typeof momentObj !== 'object') {
            // edittedMomentObj = moment()
            setInputField(null)
            onChange(null)
        } else {
            const selectUnixTimestamp = parseInt(edittedMomentObj.format('x'))
            // const selectISO8601 = new Date(selectUnixTimestamp).toISOString()

            const selectISO8601 = new Date(selectUnixTimestamp).toISOString()

            setInputField(selectUnixTimestamp)
            onChange(selectISO8601)
        }
    }

    // get current unix timestamp
    const nowHandler = (e) => {
        e.preventDefault()
        const nowUnixTimestamp = Date.now()
        const nowISO8601 = new Date(nowUnixTimestamp).toISOString()

        setInputField(nowUnixTimestamp)
        onChange(nowISO8601)
    }

    const { hasNowBtn } = config
    const inputProps = {
        placeholder: isReadOnly ? '' : '請輸入日期',
        disabled: isReadOnly,
    }

    return (
        <div className="NewDateTime">
            <Datetime
                value={inputField}
                initialValue={newValue ? newValue : ''}
                onChange={(momentObj) => changeHandler(momentObj)}
                dateFormat="YYYY-MM-DD Z"
                timeFormat="HH:mm:ss"
                strictParsing={false}
                inputProps={inputProps}
            />
            {hasNowBtn ? (
                <button className="nowButton" onClick={(e) => nowHandler(e)}>
                    Now
                </button>
            ) : null}
        </div>
    )
}

export default NewDateTime
