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

        const parser = new Parser({
            onopentag(name, attributes) {
                /*
                 * This fires when a new tag is opened.
                 *
                 * If you don't need an aggregated `attributes` object,
                 * have a look at the `onopentagname` and `onattribute` events.
                 */
                console.log('open tag ' + name)

                if (name === 'p') {
                    block = {
                        key: _uuid(),
                        text: '',
                        type: 'unstyled',
                        depth: 0,
                        inlineStyleRanges: [],
                        entityRanges: [],
                        data: {},
                    }
                } else if (isInlineStyle(name)) {
                    // <em><strong>原料藥廠</strong></em>
                    inlineStyleRange.offset = block.text.length
                    styleArray.push(getInlineStyleName(name))
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
                    inlineStyleRange.length = text.length
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

                if (tagname === 'p') {
                    block.inlineStyleRanges = inlineStyleRanges
                    blocks.push(block)
                    block = {}
                    inlineStyleRanges = []
                } else if (isInlineStyle(tagname)) {
                    // <em><strong>原料藥廠</strong></em>
                    const outerTag = styleArray[0]
                    console.log(getInlineStyleName(tagname))
                    if (getInlineStyleName(tagname) !== outerTag) {
                        console.log('if ' + getInlineStyleName(tagname))
                        const innerTagInlineStyleRange = {
                            offset: inlineStyleRange.offset,
                            length: inlineStyleRange.length,
                            style: styleArray[styleArray.length - 1],
                        }

                        console.log(inlineStyleRanges)
                        inlineStyleRanges.push(innerTagInlineStyleRange)
                        console.log('ready to pop')
                        console.log(styleArray)
                        styleArray.pop() // remove innerTag
                        console.log(styleArray)
                    } else {
                        console.log('else ' + getInlineStyleName(tagname))

                        const outerTagInlineStyleRange = {
                            offset: inlineStyleRange.offset,
                            length: inlineStyleRange.length,
                            style: outerTag,
                        }
                        inlineStyleRanges.push(outerTagInlineStyleRange)
                        console.log(inlineStyleRanges)

                        // clear temp
                        inlineStyleRange = {
                            offset: 0,
                            length: 0,
                        }
                        styleArray = []
                    }
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
