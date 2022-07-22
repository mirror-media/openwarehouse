const { Keystone } = require('@keystonejs/keystone')
const { GraphQLApp } = require('@keystonejs/app-graphql')
const { AdminUIApp } = require('@keystonejs/app-admin-ui')
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex')
const { PasswordAuthStrategy } = require('@keystonejs/auth-password')
const { StaticApp } = require('@keystonejs/app-static')
const { PreviewApp } = require('./customApps/PreviewApp')

var bodyParser = require('body-parser')

const {
    app,
    database,
    session,
    redis: redisConf,
} = require('./configs/config.js')
const lists = require(`./lists/${app.project}`)
const createDefaultAdmin = require('./helpers/createDefaultAdmin')

const redis = require('redis')
const expressSession = require('express-session')
const RedisStore = require('connect-redis')(expressSession)
const { RedisCache, RedisClusterCache } = require('apollo-server-cache-redis')
const responseCachePlugin = require('apollo-server-plugin-response-cache')
const ioredis = require('ioredis')

const adapterConfig = {
    dropDatabase: app.dropDatabase,
    knexOptions: {
        client: 'postgres',
        connection: `postgresql://${database.acc}:${database.pass}@${database.host}/${database.db}`,
    },
}

const newRedisClient = (redisConf) => {
    const { options } = redisConf
    switch (redisConf.type) {
        case 'single':
            return new ioredis(
                {
                    port: redisConf.nodes[0].port, // First Redis port
                    host: redisConf.nodes[0].host, // First Redis host
                },
                {
                    password: options.authPass,
                }
            )
        case 'cluster':
            return new ioredis.Cluster(redisConf.nodes, {
                scaleReads: options.scaleReads,
                redisOptions: {
                    password: options.authPass,
                },
            })
        default:
            return null
    }
}

const keystone = new Keystone({
    adapter: new Adapter(adapterConfig),
    cookie: {
        // If it's explicitly configured to use insecure cookies, overwrite the default setting.
        // Anything else will be fallback to the default of true in production.
        secure:
            session.secure === false
                ? false
                : process.env.NODE_ENV === 'production',
    },
    cookieSecret: session.cookieSecret,
    onConnect: createDefaultAdmin(app.project),
    sessionStore: new RedisStore({
        client: newRedisClient(redisConf),
        ttl: session.ttl,
        prefix: `${app.uuid}-ss:`,
    }),
})

for (var name in lists) {
    // Remove cacheHint if we want users to reach realtime data
    if (!app.isGraphQLCached) {
        delete lists[name].cacheHint
    }
    keystone.createList(name, lists[name])
}

const authStrategy = keystone.createAuthStrategy({
    type: PasswordAuthStrategy,
    list: app.authList,
})

// Default apollo options
const apolloDftOptions = {
    introspection: true,
}

// apollo Redis cache options
const apolloRedisCacheOptions = {}
if (!!app.isGraphQLCached) {
    const { options } = redisConf
    switch (redisConf.type) {
        case 'single':
            apolloRedisCacheOptions.plugins = [responseCachePlugin()]
            apolloRedisCacheOptions.cache = new RedisCache({
                host: redisConf.nodes[0].host,
                port: redisConf.nodes[0].port,
                password: options.authPass,
            })
            break
        case 'cluster':
            apolloRedisCacheOptions.plugins = [responseCachePlugin()]
            apolloRedisCacheOptions.cache = new RedisClusterCache(
                redisConf.nodes,
                {
                    scaleReads: options.scaleReads,
                    redisOptions: {
                        password: options.authPass,
                    },
                }
            )
            break
        default:
            throw 'wrong redis type'
    }
}

const graphQLOptions = {
    apollo: {
        ...apolloDftOptions,
        ...apolloRedisCacheOptions,
        maxFileSize: 300 * 1024 * 1024,
    },
}

let optionalApps = []

if (!!app.isAdminAppRequired) {
    optionalApps.push(
        new AdminUIApp({
            name: app.applicationName,
            enableDefaultRoute: true,
            hooks: require.resolve(`./hooks/${app.project}`),
            authStrategy,
        }),
        new StaticApp({ path: '/', src: 'public' }),
        new PreviewApp({ path: '/story' })
    )
}

module.exports = {
    keystone,
    apps: [new GraphQLApp(graphQLOptions), ...optionalApps],
    // express setting
    configureExpress: (app) => {
        app.set('trust proxy', true)
        app.use(bodyParser.json({ limit: '2mb' }))
        app.get('/', (req, res) => {
            res.send('OK')
        })
    },
}
// [CI SKIP]
