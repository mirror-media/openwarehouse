const {
    convertToRaw,
    convertFromRaw,
    EditorState,
    ContentState,
} = require('draft-js')
const { app } = require('../configs/config.js')
const htmlToJson = require('html-to-json')
const { Parser } = require('htmlparser2')

const blockquoteKeyMap = ['quote', 'quoteBy']

const htmlToDraft = async (existingItem, resolvedData) => {
    try {
        const html = existingItem.summaryHtml
        console.log(html)
        const contentBlock = JSON.parse(existingItem.summary)

        contentBlock.blocks.forEach((block) => {
            console.log(block)
        })
        Object.keys(contentBlock.entityMap).forEach((key) => {
            console.log(contentBlock.entityMap[key])
        })
        // entityMap: {
        //     '0': { type: 'ANNOTATION', mutability: 'IMMUTABLE', data: [Object] },
        //     '1': { type: 'ANNOTATION', mutability: 'IMMUTABLE', data: [Object] },

        const convertedContentBlock = await convertHtmlToContentBlock(html)

        console.log('+++blocks+++')
        convertedContentBlock.blocks.forEach((block) => {
            console.log(block)
        })
        console.log('+++entityMap+++')
        console.log(convertedContentBlock.entityMap)
        // Object.keys(entityMap).forEach((key) => {
        //     console.log(entityMap[key])
        // })

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
        // entityMap: {
        //     '0': { type: 'ANNOTATION', mutability: 'IMMUTABLE', data: [Object] },
        //     '1': { type: 'ANNOTATION', mutability: 'IMMUTABLE', data: [Object] },

        // block
        let blocks = []
        let block = {}

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

                    // case 'blockquote':
                    //     block = {
                    //         key: _uuid(),
                    //         text: '',
                    //         type: 'blockquote',
                    //         depth: 0,
                    //         inlineStyleRanges: [],
                    //         entityRanges: [],
                    //         data: {},
                    //     }
                    //     break

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

                    case 'div':
                        isManipulateAtomicBlock = true

                    case 'blockquote':
                        currentEntity = 'BLOCKQUOTE'

                        if (isManipulateAtomicBlock) {
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
                                type: 'BLOCKQUOTE',
                                mutability: 'IMMUTABLE',
                                data: { quoteBy: '', quote: '' },
                            }
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
                        block.text = text

                        if (entityRange?.key) {
                            entity.data.text = text
                        }
                        break

                    case 'strong':
                    case 'em':
                    case 'u':
                        block.text = block.text + text
                        break

                    case 'abbr':
                        console.log('text in abbr')
                        console.log(text)
                        entityRange.length = text.length
                        block.text = block.text + text

                        currentTag = prevTag
                        break

                    case 'a':
                        console.log('AAAAAAAA')
                        console.log(text)
                        block.text = block.text + text
                        entity.data.text = text
                        entityRange.length = text.length

                        currentTag = prevTag
                        break

                    case 'blockquote':
                        blockquoteArray.push(text)
                        break

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
                        // case 'blockquote':

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
                        console.log('===close tag in a')

                        addEntityRangeToBlock(entityRange)

                        addEntityToEntityMap(entity)

                        console.log(block)
                        console.log(entityMap)

                        break

                    case 'blockquote':
                        if (isManipulateAtomicBlock) {
                            console.log('blockquoteArray')
                            console.log(blockquoteArray)

                            // [ '我是quote', '我是quoteBy' ]

                            for (let i = 0; i < blockquoteArray.length; i++) {
                                blockquoteKey = blockquoteKeyMap[i] // quote || quoteBy
                                if (!blockquoteKey) continue

                                const quoteItem = blockquoteArray[i]
                                entity.data[blockquoteKey] = quoteItem
                            }

                            console.log('block')
                            console.log(block)
                            block.entityRanges.push(entityRange)
                            entityRange = {}

                            entityMap[entityKey.toString()] = entity
                            entityKey++

                            block.inlineStyleRanges = inlineStyleRanges
                            blocks.push(block)
                            block = {}
                            inlineStyleRanges = []

                            currentAtomicBlockType = ''
                            isManipulateAtomicBlock = false
                        }
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
