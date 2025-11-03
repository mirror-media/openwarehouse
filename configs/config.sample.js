/* This configuration follows YAML naming style. */

module.exports = {
    main: {
        project: 'your-project-name',
        applicationName: "applicationName",
        authList: "authList",
        uuid: 'uuid',
        dropDatabase: false,
        isGraphQLCached: false,
        isAdminAppRequired: true,
    },
    database: {
        host: "host",
        db: "name",
        acc: "acc",
        pass: "pass",
    },
    session: {
        cookieSecret: "cookieSecret",
        ttl: 3600,
        prefix: "ks-sess"
    },
    storage: {
        gcpUrlBase: 'gcpUrlBase',
        webUrlBase: 'webUrlBase',
        bucket: 'your-bucket-name',
        imgUrlBase: 'imgUrlBase',
        videoUrlBase: '/video-files',
    },
    redis: {
        host: "host",
        port: "port",
        authPass: "authPass"
    },
    youtube: {
        apiKey: "your_youtube_api_key"
    },
}