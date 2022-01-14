const {
    returnExistedKeyValueBetweenObjects,
} = require('./returnExistedKeyValueBetweenObjects')

const validateIfPostNeedPublishTime = async (
    existingItem,
    resolvedData,
    addValidationError
) => {
    const currentPostState = returnExistedKeyValueBetweenObjects(
        'state',
        resolvedData,
        existingItem
    )
    const currentPublishTime = returnExistedKeyValueBetweenObjects(
        'publishTime',
        resolvedData,
        existingItem
    )
    const needPublishTime =
        currentPostState === 'published' || currentPostState === 'scheduled'
    const noPublishTime =
        currentPublishTime === null || typeof currentPublishTime === 'undefined'

    if (needPublishTime && noPublishTime) {
        addValidationError(
            '若狀態為「Published」、「Scheduled」，則發佈時間不能空白'
        )
    }
}

const validateIfPublishTimeIsFutureTime = async (
    existingItem,
    resolvedData,
    addValidationError
) => {
    const currentPostState = returnExistedKeyValueBetweenObjects(
        'state',
        resolvedData,
        existingItem
    )

    const postPublishTime = returnExistedKeyValueBetweenObjects(
        'publishTime',
        resolvedData,
        existingItem
    )

    const needValidatePublishTime =
        currentPostState === 'published' || currentPostState === 'scheduled'

    if (needValidatePublishTime) {
        const nowTime = new Date(Date.now())
        const currentPublishTime = new Date(postPublishTime)

        if (currentPostState === 'published') {
            // newDateTime field's "now" button active only within 60s,
            // and can't be future time
            const publishTimeIsNow =
              currentPublishTime - nowTime >= -3600000 &&
              currentPublishTime - nowTime < 0
            
            const hasCangeStateOrPublishTime = resolvedData.state || resolvedData.publishTime
            
            if (hasCangeStateOrPublishTime && !publishTimeIsNow) {
              addValidationError('若狀態為「Published」，則發佈時間必須是現在')
            }
        }

        if (currentPostState === 'scheduled') {
            // newDateTime field's "now" button active only within 60s
            const publishTimeIsFutureTime = currentPublishTime - nowTime >= -3600000

            if (!publishTimeIsFutureTime) {
                addValidationError('若狀態為「Scheduled」，則發佈時間不能是過去的時間')
            }
        }
    }
}

module.exports = {
    validateIfPostNeedPublishTime,
    validateIfPublishTimeIsFutureTime,
}
