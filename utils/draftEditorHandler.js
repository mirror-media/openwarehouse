const countWord = async (existingItem, resolvedData) => {
    try {
        const content = resolvedData?.content
            ? JSON.parse(resolvedData?.content)
            : undefined

        // only edited draft editor need to count words
        if (!content || !content?.blocks) return 0

        let totalCount = 0
        content.blocks.forEach((block) => {
            const blockWordsCount = block?.text?.length || 0
            totalCount += blockWordsCount
        })

        return totalCount
    } catch (error) {
        console.error(error)
        return 0
    }
}

module.exports = { countWord }
