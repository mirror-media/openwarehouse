const validateIfReportPostHaveSlug = (existingItem, resolvedData, addValidationError) => {
    const currentStyle = resolvedData?.style || existingItem?.style
    const currentPostSlug = resolvedData?.slug || existingItem?.slug

    const needSlug = currentStyle === 'project3' || currentStyle === 'report'
    const noSlug = currentPostSlug === '' || currentPostSlug === null || typeof currentPostSlug === 'undefined'

    if (needSlug && noSlug) {
        addValidationError('若文章樣式為「project3」、「report」，則 Slug 不能空白')
    }
}

module.exports = { validateIfReportPostHaveSlug }
