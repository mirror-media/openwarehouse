const { app, project } = require('../../configs/config')

function getPostIdFromUrl() {
    const currentUrl = document.location.href

    const devideArray = currentUrl.split('/')
    if (devideArray.length > 2) {
        const id = devideArray[devideArray.length - 1]
        const currentListName = devideArray[devideArray.length - 2]
        return { id, currentListName }
    } else {
        return {
            id: null,
            currentListName: null,
        }
    }
}

function getPreviewUrl(postId) {
    return `/preview/posts/${postId}`
}

module.exports = { getPostIdFromUrl, getPreviewUrl }
