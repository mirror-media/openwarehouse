const admin = ({ authentication: { item: user } }) =>
    Boolean(user && user.role == 'admin')
const moderator = ({ authentication: { item: user } }) =>
    Boolean(user && user.role == 'moderator')
const editor = ({ authentication: { item: user } }) =>
    Boolean(user && user.role == 'editor')
const contributor = ({ authentication: { item: user } }) =>
    Boolean(user && user.role == 'contributor')

const bot = ({ authentication: { item: user } }) =>
    Boolean(user && user.role == 'bot')

const owner = ({ authentication: { item: user }, listKey, existingItem }) => {
    if (!user) return false

    if (listKey == 'User') return { id: user.id }
    if (existingItem?.createdBy == user.id) return existingItem?.createdBy == user.id //for field level ACL
    return { createdBy: { id: user.id } }
}

const allowRoles = (...args) => {
    return (auth) => {
        return args.reduce((result, check) => result || check(auth), false)
    }
}

module.exports = {
    admin,
    moderator,
    editor,
    contributor,
    bot,
    owner,
    allowRoles,
}
