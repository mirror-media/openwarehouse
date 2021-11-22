const validateIfReportPosthaveSlug = (existingItem, resolvedData, addValidationError) => {
    const currentStyle = resolvedData.style
    const currentPostSlug = resolvedData.slug || existingItem.slug

    const needSlug = currentStyle === 'project3' || currentStyle === 'report'
    const noPublishTime = currentPostSlug === null || typeof currentPostSlug === 'undefined'

    if (needSlug && noPublishTime) {
        addValidationError('若文章樣式為「project3」、「report」，則 Slug 不能空白')
    }
}

module.exports = { validateIfReportPosthaveSlug }
