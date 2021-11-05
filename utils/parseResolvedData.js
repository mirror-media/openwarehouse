/*
resolveData:
    edited fields in list (created data, updated new data)
    it's null only when there's no updated data

existingItem:
    when created, existingItem is null,
    when updated, it represent the old data
*/

/* 
Every DraftEditor field has 3 corresponding data:
editorState,html and api data
three of them are packaged in content (in Controller)

before save post,
need to get html and api data in content
and put them to resolvedData
*/

const parseResolvedData = ({
    existingItem,
    resolvedData,
    draftFieldNameArray,
}) => {
    // get every draft field's storedEditorContent
    let fieldsArray = draftFieldNameArray
    if (!fieldsArray?.length) return

    try {
        // only modified draft is needed to parse
        // push the wanted draft field to storedEditorContentsArray
        const storedEditorContentsArray = []
        for (let i = 0; i < fieldsArray.length; i++) {
            const key = fieldsArray[i]
            if (_isFeedDataFromGraphQL(resolvedData, key)) continue

            if (resolvedData[key]) {
                const waitingForParseObj = {
                    field: key,
                    editorContent: resolvedData[key],
                }
                storedEditorContentsArray.push(waitingForParseObj)
            }
        }

        // [summary(obj), brief(obj), content(obj)]
        storedEditorContentsArray.forEach(({ field, editorContent }) => {
            let currentEditorContentValve = _getEditorContentValue(
                editorContent
            )
            _feedFieldValueToResolvedData(field, currentEditorContentValve)
        })
    } catch (err) {
        console.log(err)
        console.log('EXISTING ITEM')
        console.log(existingItem)
        console.log('RESOLVED DATA')
        console.log(resolvedData)
    }

    function _getEditorContentValue(editorContent) {
        if (!editorContent) {
            // if it's undefined(create from api), return initial data
            return {
                html: '',
                apiData: '',
            }
        } else {
            // if has editorContent, JSON it.
            return JSON.parse(editorContent)
        }
    }

    function _feedFieldValueToResolvedData(currentField, currentEditorContent) {
        // storedEditorContent is formated to 3 part:
        // draftState itself, contentHTML, and contentApidata
        // destructure them and put it into resolvedData's key
        const { draft, html, apiData } = currentEditorContent

        // ex:brief
        // resolvedData.brief = currentEditorContent
        // resolvedData.briefHtml = html
        // resolvedData.cbriefApiData = JSON.stringify(apiData)
        resolvedData[`${currentField}`] = JSON.stringify(draft)
        resolvedData[`${currentField}Html`] = html
        resolvedData[`${currentField}ApiData`] = JSON.stringify(apiData)
    }

    function _generateDraftFieldsArray() {
        switch (app.project) {
            case 'readr':
                return ['summary', 'brief', 'content', 'actionList', 'citation']

            case 'mirrormedia':
                return ['brief', 'content']

            case 'mirror-tv':
                return ['brief', 'content']

            default:
                return ['brief', 'content']
        }
    }

    function _isFeedDataFromGraphQL(resolvedData, key) {
        // ex:
        // if content, contentApiData and contentHtml are existed together in resolvedData
        // means the data is come from graphQL
        // then no need to parse
        if (
            resolvedData[key] &&
            resolvedData[`${key}ApiData`] &&
            resolvedData[`${key}Html`]
        ) {
            // console.log('data is from gql')
            return true
        } else {
            // console.log('data is from cms')
            return false
        }
    }
}

module.exports = { parseResolvedData }
