const fieldFilter = {
    gateFieldName: 'state',
    fieldPassValue: ['published', 'invisible'],
}

function getAccessControlViaServerType(...args) {
    const serviceType = process.env.K5_SERVICE_TYPE || 'CMS'

    switch (serviceType) {
        // if type of server is GQL (which handles front-end website)
        // then restrict read access via user's role
        // (anonymous can only read public)
        case 'GQL':
            return (auth) => {
                return blockFieldToAnonymous(auth, args)
            }

        // if type of server is Preview,
        // then open the gate of access
        case 'PREVIEW':
            return true

        // if type of server is CMS,
        // then use normal allowRoles
        // only logged-in user can read data
        // (anonymous can't read anything)
        case 'CMS':

        default:
            return (auth) => {
                return allowRoles(auth, args)
            }
    }
}

function allowRoles(auth, args) {
    return args.reduce((result, check) => result || check(auth), false)
}

function blockFieldToAnonymous(auth, args) {
    const { gateFieldName, fieldPassValue } = fieldFilter

    const {
        authentication: { item },
    } = auth
    // if request is from keystone itself,
    // item will have logged-in user data
    // otherwise not only nuxt, but just normal gql request will have undefined
    const role = item ? item.role : 'anonymous'

    if (role === 'anonymous') {
        const accessControl = {}
        const key = `${gateFieldName}_in`
        accessControl[key] = fieldPassValue

        return accessControl
    } else {
        return allowRoles(auth, args)
    }
}

module.exports = { getAccessControlViaServerType }
