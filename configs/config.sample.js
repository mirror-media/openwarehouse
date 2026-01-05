/* This configuration follows YAML naming style. */

module.exports = {
    main: {
        applicationName: 'applicationName',
        authList: 'authList',
        dropDatabase: true,
    },
    database: {
        host: 'host',
        db: 'name',
        acc: 'acc',
        pass: 'pass',
    },
    session: {
        cookieSecret: 'cookieSecret',
        ttl: 3600,
        prefix: 'ks-sess',
    },
    redis: {
        host: 'host',
        port: 'port',
        authPass: 'authPass',
    },
    cronService: {
        apiUrlBase: 'http://localhost:5000',
    },
}
