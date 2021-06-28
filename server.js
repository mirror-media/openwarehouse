const express = require('express')
const { keystone, apps } = require('./index')
const { createProxyMiddleware } = require('http-proxy-middleware');

keystone
  .prepare({
    apps,
    dev: process.env.NODE_ENV !== 'production',
    //dev: false,
  })
  .then(async ({ middlewares }) => {
    await keystone.connect();
    const app = express()
    const preview = express.Router()

    app.use(middlewares);
    preview.use((req, res, next) => {
      if (req.session && req.session.keystoneListKey === 'User') {
        next()
        return
      }
      res.redirect('/admin/signin')
    })
    preview.get('/story/*',
      createProxyMiddleware(
        {
          target: 'https://dev.mnews.tw',
          changeOrigin: true,
          pathRewrite: {
            '/preview/story': '/story'
          }
        },))
    app.use('/preview', preview)

    app.listen(3000)
  });

