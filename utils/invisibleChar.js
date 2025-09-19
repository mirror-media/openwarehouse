// 移除造成前端渲染或 JSON 序列化/反序列化問題的不可見字元
// 覆蓋範圍：
// - Zero-width: U+200B..U+200D, U+FEFF
// - Bidi controls: U+061C, U+200E..U+200F, U+202A..U+202E, U+2066..U+2069
// - JS/HTML 問題字元：U+2028, U+2029 (Line/Paragraph separator)
const INVISIBLE_OR_CONTROL_REGEX = /[\u200B-\u200D\uFEFF\u061C\u200E\u200F\u202A-\u202E\u2066-\u2069\u2028\u2029]/g

function removeInvisibleChars(input) {
    if (typeof input !== 'string') return input
    return input.replace(INVISIBLE_OR_CONTROL_REGEX, '')
}

function hasInvisibleChars(input) {
    if (typeof input !== 'string') return false
    return INVISIBLE_OR_CONTROL_REGEX.test(input)
}

module.exports = { removeInvisibleChars, hasInvisibleChars }


