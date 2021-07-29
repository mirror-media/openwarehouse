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

// anonymousWithGqlControl depends on process.env.K5_SERVICE_TYPE == GQL
const anonymousWithGqlControl = ({ gqlServiceControl }) => {

    const serviceType = process.env.K5_SERVICE_TYPE || 'CMS'
    let control;

    switch (serviceType) {
        // if type of server is GQL (which handles front-end website)
        // then restrict read access via user's role
        // (anonymous can only read public)
        case 'GQL':
            control = gqlServiceControl
            break;

        // if type of server is Preview,
        // then open the gate of access
        case 'PREVIEW':
            control = true;
            break;

        // if type of server is CMS,
        // then use normal allowRoles
        // only logged-in user can read data
        // (anonymous can't read anything)
        case 'CMS':
        default:
            control = false;
    }

    return ({ authentication: { item } }) => {
        if (item === undefined) {
            return control
        }
        return false
    }
}

const allowRoles = (...args) => {
    return (auth) => {
        return args.reduce((result, check) => result || check(auth), false)
    }
}

module.exports = {
    admin,
    allowRoles,
    anonymousWithGqlControl,
    bot,
    contributor,
    editor,
    moderator,
    owner,
    registeredUsers,
}
