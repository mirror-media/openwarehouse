const countReadingTime = async (existingItem, resolvedData) => {
    try {
        const content = resolvedData?.content || existingItem?.content
            ? JSON.parse(resolvedData?.content || existingItem?.content)
            : undefined
        
        // only edited draft editor need to count readTime
        // if readingTime is manually changed, no need to count readTime either
        if (!content || !content?.blocks || resolvedData.readingTime) return

        const reportStyles = ['project3', 'embedded', 'report']
        const entityKeys = Object.keys(content.entityMap)

        // if style is replaced to report, clear readingTime and return
        if (reportStyles.includes(resolvedData.style)) {
            resolvedData.readingTime = 0
            return
        }

        // count words
        let totalWordCount = 0
        content.blocks.forEach((block) => {
            const blockWordsCount = block?.text?.length || 0
            totalWordCount += blockWordsCount
        })

        // count images and embeddedCode
        const imageList = entityKeys.filter((key) => content.entityMap[key].type === 'IMAGE' || content.entityMap[key].type === 'EMBEDDEDCODE') || []
        const totalImageCount = imageList.length

        // count read time which based on words and images
        const readingTime = Math.round((totalWordCount / 8 + totalImageCount * 10) / 60)

        resolvedData.readingTime = readingTime || 0
    } catch (error) {
        console.error(error)
        return
    }
}

module.exports = { countReadingTime }
