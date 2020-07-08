/* This configuration follows YAML naming style. */

module.exports = {
    app: {
        applicationName: "Sorcerer's Stone",
        authList: "User",
        // dropDatabase: true,
        project: "mirrormedia",
    },
    database: {
        host: "104.199.157.26",
        db: "sorcerers_stone",
        acc: "keystone_agent",
        pass: "keystone_agent11",
    },
    session: {
        cookieSecret: "6629352e37a0a7e73497f62720207225649542c064eda9dc8d16134721017303",
        ttl: 3600,
        prefix: "ks-sess"
    },
    redis: {
        host: "35.229.222.166",
        port: "6379",
        authPass: "ZgbRu7SP"
    }
}