const countReadingTime = async (existingItem, resolvedData) => {
    try {
        const content = resolvedData?.content
            ? JSON.parse(resolvedData?.content)
            : undefined

        // only edited draft editor need to count readTime
        if (!content || !content?.blocks || resolvedData.readingTime) return

        console.log('content', content)

        // count words
        let totalWordCount = 0
        content.blocks.forEach((block) => {
            const blockWordsCount = block?.text?.length || 0
            totalWordCount += blockWordsCount
        })

        // count images
        const entityKeys = Object.keys(content.entityMap)
        const imageList = entityKeys.filter((key) => content.entityMap[key].type === 'IMAGE') || []
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
