const { Keystone } = require('@keystonejs/keystone');
const { GraphQLApp } = require('@keystonejs/app-graphql');
const { AdminUIApp } = require('@keystonejs/app-admin-ui');
const { KnexAdapter: Adapter } = require('@keystonejs/adapter-knex');
const { PasswordAuthStrategy } = require('@keystonejs/auth-password');

const { main, database, session, redis: redisConf } = require('./configs/config.js')
const createDefaultAdmin = require('./helpers/createDefaultAdmin')
const lists = require('./lists');

const redis = require('redis');
const expressSession = require('express-session');
const RedisStore = require('connect-redis')(expressSession);

const adapterConfig = {
  dropDatabase: main.dropDatabase,
  knexOptions: {
    client: 'postgres',
    connection: `postgresql://${database.acc}:${database.pass}@${database.host}/${database.db}`,
  }
};

const keystone = new Keystone({
  name: main.applicationName,
  adapter: new Adapter(adapterConfig),
  cookieSecret: session.cookieSecret,
  onConnect: createDefaultAdmin,
  sessionStore: new RedisStore({
    client: redis.createClient({
      host: redisConf.host,
      port: redisConf.port,
      auth_pass: redisConf.authPass,
      prefix: session.prefix,
    }),
    options: {
      ttl: session.ttl
    }
  })
});

for (var name in lists) {
  keystone.createList(name, lists[name]);
  console.log(`${name} created`)
}

const authStrategy = keystone.createAuthStrategy({
  type: PasswordAuthStrategy,
  list: main.authList,
});

module.exports = {
  keystone,
  apps: [
    new GraphQLApp({
      enableDefaultRoute: true,
      authStrategy,
    }),
    new AdminUIApp({
      enableDefaultRoute: true,
      hooks: require.resolve('./hooks'),
      authStrategy,
    }),
  ],
};
