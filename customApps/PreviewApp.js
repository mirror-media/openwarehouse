const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

// PreviewApp
// it generate a new preview route
class PreviewApp {
    constructor({ path }) {
        this._path = path
    }

    getPreviewRouter() {
        const preview = express.Router()

        preview.use((req, res, next) => {
            // check if this req is verified
            // if not, then redirect to login page
            if (req.session && req.session.keystoneListKey === 'User') {
                next()
                return
            }
            res.redirect('/admin/signin')
        })

        preview.get(
            '/posts/*',
            createProxyMiddleware({
                target: process.env.K5_PREVIEW_URL || 'http://localhost:3001',
                changeOrigin: true,
                pathRewrite: {
                    '/preview/posts': '/story',
                },
            })
        )

        return preview
    }

    prepareMiddleware() {
        const app = express()
        app.use(this._path, this.getPreviewRouter())
        return app
    }
}

module.exports = {
    PreviewApp,
}
