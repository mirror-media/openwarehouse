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

const owner = ({ authentication: { item: user }, listKey }) => {
    if (!user) return false

    if (listKey == 'User') return { id: user.id }

    return { createdBy: { id: user.id } }
}

const registeredUsers = ({ authentication: { item } }) => Boolean(!!item)

const anonymousWithDeclarativeControl = (control) => {
    return ({ authentication: { item } }) => {
        if (item === undefined) {
            return control
        }
        return false
    }
}

const anonymousWithPublishedOrInvisibleStateAccess = anonymousWithDeclarativeControl({ 'state_in': ['published', 'invisible'] })

const allowRoles = (...args) => {
    return (auth) => {
        return args.reduce((result, check) => result || check(auth), false)
    }
}

module.exports = {
    admin,
    allowRoles,
    anonymousWithPublishedOrdInvisibleStateAccess,
    bot,
    contributor,
    editor,
    moderator,
    owner,
    registeredUsers,
}
