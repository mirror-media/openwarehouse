const controlCharacterFilter = (originalInput, existingItem, resolvedData) => {
    const modifiedList = Object.keys(originalInput)

    const rules = /[\u0000-\u001F\u007F-\u009F]/g
    modifiedList.forEach((modifiedKey) => {
        // if this key is null, it means no needed to handle it, just return
        if (!resolvedData[modifiedKey]) return
        if (typeof resolvedData[modifiedKey] !== 'string') return

        console.log(`checking for ${modifiedKey}'s control character...`)
        resolvedData[modifiedKey] = resolvedData[modifiedKey].replace(rules, '')
    })
}

module.exports = { controlCharacterFilter }
