const {
    convertToRaw,
    convertFromRaw,
    EditorState,
    ContentState,
} = require('draft-js')
const { app } = require('../configs/config.js')
const htmlToJson = require('html-to-json')
const { Parser } = require('htmlparser2')

const clear = (resolvedData) => {
    console.log('clear')
    const editorState = EditorState.createEmpty()
    const contentState = editorState.getCurrentContent()
    const emplyContentBlock = convertToRaw(contentState)
    resolvedData.summary = emplyContentBlock
    resolvedData.content = emplyContentBlock
}
const htmlToDraft = (existingItem, resolvedData) => {
    try {
        const html = existingItem.contentHtml
        console.log(html)
        const contentBlock = JSON.parse(existingItem.content)

        contentBlock.blocks.forEach((block) => {
            console.log(block)
        })
        let blocks = []
        let inlineStyleRanges = []
        let block = {}
        let inlineStyleRange = {
            offset: 0,
            length: 0,
        }
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

        const parser = new Parser({
            onopentag(name, attributes) {
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
                console.log('-->', text)
                block.text = block.text + text

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
                        block.inlineStyleRanges = inlineStyleRanges
                        blocks.push(block)
                        block = {}
                        inlineStyleRanges = []
                        break

                    case 'strong':
                        inlineStyleRanges.push(boldInlineStyleRange)

                        if (styleArray.length) {
                            styleArray.pop()
                        }
                        break
                    case 'em':
                        inlineStyleRanges.push(italicInlineStyleRange)

                        if (styleArray.length) {
                            styleArray.pop()
                        }
                        break
                    case 'u':
                        inlineStyleRanges.push(underlineInlineStyleRange)

                        if (styleArray.length) {
                            styleArray.pop()
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

        blocks.forEach((block) => {
            console.log(block)
        })

        const converedContentBlock = {
            blocks,
            entityMap: {},
        }

        return JSON.stringify({
            draft: converedContentBlock,
            html: '',
            apiData: '',
        })
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

module.exports = { htmlToDraft, clear }
