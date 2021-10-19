const { Parser } = require('htmlparser2')

const htmlToDraft = async (existingItem, resolvedData) => {
    try {
        const html = existingItem.tempContentHtml
        const isHtmlText = html.includes('<p>')

        let convertedContentBlock
        if (isHtmlText) {
            convertedContentBlock = await convertHtmlToContentBlock(html)
        } else {
            convertedContentBlock = {
                blocks: [
                    {
                        key: '6123a',
                        text: html,
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    },
                ],
                entityMap: {},
            }
        }

        return JSON.stringify({
            draft: convertedContentBlock,
            html: '',
            apiData: '',
        })
    } catch (error) {
        console.log(error)
        return undefined
    }
}

function convertHtmlToContentBlock(html) {
    if (!html) return undefined

    try {
        // block
        let blocks = []
        let block = {
            key: _uuid(),
            text: '',
            type: 'unstyled',
            depth: 0,
            inlineStyleRanges: [],
            entityRanges: [],
            data: {},
        }

        // inlineStyleRange
        let inlineStyleRanges = []
        let styleArray = []
        let boldInlineStyleRange = {
            offset: 0,
            length: 0,
            style: 'BOLD',
        }
        let italicInlineStyleRange = {
            offset: 0,
            length: 0,
            style: 'ITALIC',
        }
        let underlineInlineStyleRange = {
            offset: 0,
            length: 0,
            style: 'UNDERLINE',
        }

        // list
        let currentListType = 'ordered-list-item'

        // entityMap
        let entityMap = {}
        let entityRange = {}
        let entityKey = 0
        let entity = {}

        // flow flag
        let currentTag = 'p'
        let prevTag = 'p'
        let currentEntity = ''
        let isManipulateAtomicBlock = false

        let blockquoteArray = []

        const parser = new Parser({
            onopentag(name, attributes) {
                prevTag = currentTag
                currentTag = name

                /*
                 * This fires when a new tag is opened.
                 *
                 * If you don't need an aggregated `attributes` object,
                 * have a look at the `onopentagname` and `onattribute` events.
                 */
                console.log('open tag ' + name)

                switch (name) {
                    case 'p':
                        block = {
                            key: _uuid(),
                            text: '',
                            type: 'unstyled',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        }
                        break
                    case 'h1':
                        block = {
                            key: _uuid(),
                            text: '',
                            type: 'header-one',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        }
                        break
                    case 'h2':
                        block = {
                            key: _uuid(),
                            text: '',
                            type: 'header-two',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        }
                        break
                    case 'code':
                        block = {
                            key: _uuid(),
                            text: '',
                            type: 'code-block',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        }
                        break

                    case 'ol':
                        currentListType = 'ordered-list-item'
                        break
                    case 'ul':
                        currentListType = 'unordered-list-item'
                        break
                    case 'li':
                        block = {
                            key: _uuid(),
                            text: '',
                            type: currentListType,
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        }

                        break

                    case 'blockquote':
                        block = {
                            key: _uuid(),
                            text: '',
                            type: 'blockquote',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        }
                        break

                    case 'strong':
                        boldInlineStyleRange.offset = block.text.length
                        styleArray.push('BOLD')
                        break
                    case 'em':
                        italicInlineStyleRange.offset = block.text.length
                        styleArray.push('ITALIC')
                        break
                    case 'u':
                        underlineInlineStyleRange.offset = block.text.length
                        styleArray.push('UNDERLINE')
                        break
                    case 'abbr':
                        currentEntity = 'ANNOTATION'

                        entityRange = {
                            offset: block.text.length,
                            length: 0,
                            key: entityKey,
                        }

                        const innerContentBlock = convertHtmlToContentBlock(
                            attributes.html
                        )

                        entity = {
                            type: 'ANNOTATION',
                            mutability: 'IMMUTABLE',
                            data: {
                                text: 'annotation文字',
                                annotation: attributes?.html,
                                pureAnnotationText: attributes?.title,
                                // draftRawObj: innerContentBlock,
                                draftRawObj: null,
                            },
                        }
                        break
                    case 'a':
                        if (Object.keys(block).length === 0) break
                        currentEntity = 'LINK'

                        entityRange = {
                            offset: block.text.length,
                            length: 0,
                            key: entityKey,
                        }

                        entity = {
                            type: 'LINK',
                            mutability: 'IMMUTABLE',
                            data: {
                                text: '我是連結文字',
                                url: attributes.href,
                            },
                        }
                        break

                    case 'iframe':
                        isManipulateAtomicBlock = true

                        currentEntity = 'EMBEDDEDCODE'

                        console.log('IFRAME')
                        console.log(attributes)

                        block = {
                            key: _uuid(),
                            text: ' ',
                            type: 'atomic',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        }

                        entityRange = {
                            offset: 0,
                            length: 1,
                            key: entityKey,
                        }

                        let iframeAttributeString = ''
                        Object.keys(attributes).forEach((key) => {
                            const string = `${key}="${attributes[key]}" `
                            iframeAttributeString += string
                        })

                        console.log(iframeAttributeString)
                        entity = {
                            type: 'EMBEDDEDCODE',
                            mutability: 'IMMUTABLE',
                            data: {
                                caption: '',
                                embeddedCode: `<iframe ${iframeAttributeString}></iframe>`,
                            },
                        }

                        break

                    case 'audio':
                        currentEntity = 'AUDIO'

                        block = {
                            key: _uuid(),
                            text: ' ',
                            type: 'atomic',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        }

                        entityRange = {
                            offset: 0,
                            length: 1,
                            key: entityKey,
                        }

                        entity = {
                            type: 'AUDIO',
                            mutability: 'IMMUTABLE',
                            data: {
                                id: _uuid(),
                                name: '',
                                url: attributes.src,
                                coverPhoto: null,
                            },
                        }
                        break

                    case 'video':
                        currentEntity = 'VIDEO'

                        block = {
                            key: _uuid(),
                            text: ' ',
                            type: 'atomic',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        }

                        entityRange = {
                            offset: 0,
                            length: 1,
                            key: entityKey,
                        }

                        entity = {
                            type: 'VIDEO',
                            mutability: 'IMMUTABLE',
                            data: {
                                id: _uuid(),
                                name: ' ',
                                url: attributes.src,
                                youtubeUrl: null,
                                coverPhoto: null,
                            },
                        }
                        break

                    case 'img':
                        console.log(attributes)

                        let srcObj = {}

                        if (attributes.srcset) {
                            const srcSetArray = attributes.srcset.split(', ')
                            srcSetArray.forEach((srcset) => {
                                srcsetTempArray = srcset.split(' ')
                                let srcSize = ''
                                let srcUrl = ''

                                srcsetTempArray.forEach((tempArrayItem) => {
                                    if (tempArrayItem.includes('https')) {
                                        srcUrl = tempArrayItem
                                    } else if (tempArrayItem.includes('w')) {
                                        srcSize = tempArrayItem
                                    }
                                })

                                srcObj[srcSize] = srcUrl
                            })
                        } else {
                            srcObj = {
                                '2400w': attributes.src,
                                '1280w': attributes.src,
                                '800w': attributes.src,
                            }
                        }

                        currentEntity = 'IMAGE'

                        block = {
                            key: _uuid(),
                            text: ' ',
                            type: 'atomic',
                            depth: 0,
                            inlineStyleRanges: [],
                            entityRanges: [],
                            data: {},
                        }

                        entityRange = {
                            offset: 0,
                            length: 1,
                            key: entityKey,
                        }

                        entity = {
                            type: 'IMAGE',
                            mutability: 'IMMUTABLE',
                            data: {
                                url: attributes.src,
                                original: {
                                    url: attributes.src,
                                    width: 0,
                                    height: 0,
                                },
                                desktop: {
                                    url: srcObj['2400w'],
                                    width: 0,
                                    height: 0,
                                },
                                tablet: {
                                    url: srcObj['1280w'],
                                    width: 0,
                                    height: 0,
                                },
                                mobile: {
                                    url: srcObj['800w'],
                                    width: 0,
                                    height: 0,
                                },
                                tiny: {
                                    url: srcObj['800w'],
                                    width: 0,
                                    height: 0,
                                },
                                id: '968',
                                name: attributes.alt,
                            },
                        }
                        break

                    default:
                        break
                }
            },
            ontext(text) {
                /*
                 * Fires whenever a section of text was processed.
                 *
                 * Note that this can fire at any point within text and you might
                 * have to stich together multiple pieces.
                 */

                console.log('-->', text + '( in ' + currentTag + ' )')

                switch (currentTag) {
                    case 'p':
                    case 'h1':
                    case 'h2':
                    case 'code':
                    case 'li':
                        block.text = block.text + text

                        if (entityRange?.key) {
                            entity.data.text = text
                        }
                        break

                    case 'span':
                    case 'strong':
                    case 'em':
                    case 'u':
                        block.text = block.text + text
                        break

                    case 'abbr':
                        entityRange.length = text.length
                        block.text = block.text + text

                        currentTag = prevTag
                        break

                    case 'a':
                        if (Object.keys(block).length === 0) break
                        block.text = block.text + text
                        entity.data.text = text
                        entityRange.length = text.length

                        currentTag = prevTag
                        break

                    case 'blockquote':
                        block.text = block.text + text
                        break
                    // case 'blockquote':
                    //     blockquoteArray.push(text)
                    //     break

                    default:
                        break
                }

                // for inlineStyle
                if (styleArray.length) {
                    const newestInlineStyle = styleArray[styleArray.length - 1]
                    switch (newestInlineStyle) {
                        case 'BOLD':
                            boldInlineStyleRange.length = text.length
                            break

                        case 'ITALIC':
                            italicInlineStyleRange.length = text.length
                            break

                        case 'UNDERLINE':
                            underlineInlineStyleRange.length = text.length
                            break

                        default:
                            break
                    }
                }
            },
            onclosetag(tagname) {
                /*
                 * Fires when a tag is closed.
                 *
                 * You can rely on this event only firing when you have received an
                 * equivalent opening tag before. Closing tags without corresponding
                 * opening tags will be ignored.
                 */
                console.log('close tag ' + tagname)

                switch (tagname) {
                    case 'p':
                    case 'h1':
                    case 'h2':
                    case 'code':
                    case 'li':
                    case 'blockquote':
                        if (Object.keys(block).length === 0) break
                        block.inlineStyleRanges = inlineStyleRanges
                        blocks.push(block)
                        // clear
                        block = {}
                        inlineStyleRanges = []
                        break

                    case 'abbr':
                        addEntityRangeToBlock(entityRange)

                        addEntityToEntityMap(entity)

                        break

                    case 'strong':
                        addNewInlineStyleRanges(boldInlineStyleRange)

                        if (styleArray.length) {
                            styleArray.pop()
                        }
                        break
                    case 'em':
                        addNewInlineStyleRanges(italicInlineStyleRange)

                        if (styleArray.length) {
                            styleArray.pop()
                        }
                        break
                    case 'u':
                        addNewInlineStyleRanges(underlineInlineStyleRange)

                        if (styleArray.length) {
                            styleArray.pop()
                        }
                        break
                    case 'a':
                        if (Object.keys(block).length === 0) break
                        addEntityRangeToBlock(entityRange)

                        addEntityToEntityMap(entity)

                        break

                    case 'audio':
                    case 'video':
                    case 'img':
                        addEntityRangeToBlock(entityRange)
                        addEntityToEntityMap(entity)
                        currentEntity = ''

                        blocks.push(block)
                        // clear
                        block = {}
                        inlineStyleRanges = []

                        break

                    case 'iframe':
                        addEntityRangeToBlock(entityRange)
                        addEntityToEntityMap(entity)
                        currentEntity = ''

                        blocks.push(block)
                        // clear
                        block = {}
                        inlineStyleRanges = []
                        break

                    default:
                        break
                }

                if (tagname === 'script') {
                    console.log("That's it?!")
                }
            },
        })
        parser.write(html)
        parser.end()

        const converedContentBlock = {
            blocks,
            entityMap,
        }
        // console.log('++++++++blocks+++++++++++')
        // Object.keys(blocks).forEach((key) => {
        //     console.log(blocks[key])
        // })
        // console.log('++++++++entityMap+++++++++++')

        // Object.keys(entityMap).forEach((key) => {
        //     console.log(entityMap[key])
        // })
        return converedContentBlock

        function addNewInlineStyleRanges(newInlineStyleRange) {
            inlineStyleRanges.push(newInlineStyleRange)
        }

        function addEntityRangeToBlock(newEntityRange) {
            block.entityRanges.push(newEntityRange)
            entityRange = {}
        }

        function addEntityToEntityMap(newEntity) {
            entityMap[entityKey.toString()] = newEntity
            entityKey++
        }
    } catch (error) {
        console.log(error)
        return undefined
    }
}

function _uuid() {
    var d = Date.now()
    if (
        typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
    ) {
        d += performance.now() //use high-precision timer if available
    }
    return 'xxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
    })
}

function isInlineStyle(name) {
    switch (name) {
        case 'strong':
        case 'em':
        case 'u':
            return true

        default:
            return false
    }
}

function getInlineStyleName(htmlName) {
    switch (htmlName) {
        case 'strong':
            return 'BOLD'

        case 'em':
            return 'ITALIC'

        case 'u':
            return 'UNDERLINE'
    }
}

module.exports = { htmlToDraft }
