const axios = require('axios')
const { app } = require('../configs/config.js')

const emitEditLog = async (
    operation,
    resolvedData,
    existingItem,
    context,
    updatedItem
) => {
    const { authedItem, req } = context

    const editorName = authedItem.name
    const postId = updatedItem.id
    let editedData = { ...resolvedData }

    // remove unwanted field
    editedData = removeUnusedKey(editedData)
    editedData = removeHtmlAndApiData(editedData)

    const variables = generateVariablesForGql(
        operation,
        editorName,
        postId,
        editedData
    )
    axios({
        // fetch post's slug from api which depend on server's type (dev || staging || prod)
        url: `http://localhost:3000/admin/api`,
        method: 'post',
        data: {
            query: generateGqlQueryByCMS(),
            variables,
        },
        headers: req.headers,
    })
        .then((result) => {
            // const { data, errors, extensions } = result;
            // GraphQL errors and extensions are optional
            console.log('===Editlog emitted===\n')

            if (result.data.errors) {
                console.log(result.data.errors)
            }
        })
        .catch((error) => {
            console.log(error.message)
            // respond to a network error
        })
}

function removeHtmlAndApiData(editData) {
    // 1: get keys except for id and updatedAt
    const fieldsArray = [
        'summaryHtml',
        'summaryApiData',
        'briefHtml',
        'briefApiData',
        'contentHtml',
        'contentApiData',
    ]

    fieldsArray.forEach((item) => {
        // if (editData[item]) {
        //     delete editData[item]
        // }
        delete editData[item]
    })

    return editData
}

function removeUnusedKey(editData) {
    const fieldsArray = ['createdBy', 'updatedBy', 'createdAt', 'updatedAt']

    fieldsArray.forEach((item) => {
        if (editData[item]) {
            delete editData[item]
        }
    })

    return editData
}

function generateVariablesForGql(operation, editorName, postId, editedData) {
    const fieldsArray = ['summary', 'brief', 'content']
    let variables = {
        name: editorName,
        operation: operation,
        postId: postId,
    }

    // pull out draft editor field from editedData
    // put them to variables obj, then delete original one
    fieldsArray.forEach((draftField) => {
        if (editedData[draftField]) {
            variables[draftField] = editedData[draftField]
            delete editedData[draftField]
        } else {
            // empty draft state
            variables[draftField] = ''
        }
    })

    // put rest of fields into variables.changeList
    variables.changedList = JSON.stringify(editedData)

    return variables
}

function generateGqlQueryByCMS() {
    switch (app.project) {
        case 'readr':
            return `
            mutation CreateLogList(
              $name: String!
              $operation:String!
              $postId: String!
              $summary: String!
              $brief: String!
              $content: String!
              $changedList: String!
              ) {
              createEditLog(
                data: {
                  name: $name
                  operation:$operation
                  postId: $postId
                  summary: $summary
                  brief: $brief
                  content: $content
                  changedList: $changedList
                }
              ) {
                name
              }
            }
            `

        case 'mirrormedia':
            ;`
            mutation CreateLogList(
              $name: String!
              $operation:String!
              $postId: String!
              $brief: String!
              $content: String!
              $changedList: String!
              ) {
              createEditLog(
                data: {
                  name: $name
                  operation:$operation
                  postId: $postId
                  brief: $brief
                  content: $content
                  changedList: $changedList
                }
              ) {
                name
              }
            }
            `

        case 'mirror-tv':
            return `
            mutation CreateLogList(
              $name: String!
              $operation:String!
              $postId: String!
              $brief: String!
              $content: String!
              $changedList: String!
              ) {
              createEditLog(
                data: {
                  name: $name
                  operation:$operation
                  postId: $postId
                  brief: $brief
                  content: $content
                  changedList: $changedList
                }
              ) {
                name
              }
            }
            `
        default:
            return `
            mutation CreateLogList(
              $name: String!
              $operation:String!
              $postId: String!
              $brief: String!
              $content: String!
              $changedList: String!
              ) {
              createEditLog(
                data: {
                  name: $name
                  operation:$operation
                  postId: $postId
                  brief: $brief
                  content: $content
                  changedList: $changedList
                }
              ) {
                name
              }
            }
            `
    }
}

module.exports = { emitEditLog }
