const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://100.96.1.7:8009', // Replace with your API server's URL
      changeOrigin: true,
    })
  );
};