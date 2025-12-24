/**
 * Development proxy configuration for AWS QuickSight embedding
 * This allows localhost to bypass CORS restrictions for QuickSight dashboards
 *
 * Note: This file is automatically loaded by Create React App in development mode
 */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy for QuickSight embedding
  app.use(
    '/embed',
    createProxyMiddleware({
      target: 'https://ap-southeast-2.quicksight.aws.amazon.com',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: function(proxyReq, req, res) {
        console.log('Proxying QuickSight request:', req.url);
      },
      onProxyRes: function(proxyRes, req, res) {
        // Allow embedding in iframes
        proxyRes.headers['X-Frame-Options'] = 'ALLOWALL';
        proxyRes.headers['Content-Security-Policy'] = '';
      },
      onError: function(err, req, res) {
        console.error('Proxy error:', err);
      }
    })
  );

  // Optional: Proxy for API calls if needed
  app.use(
    '/api',
    createProxyMiddleware({
      target: process.env.REACT_APP_SERVER_URL || 'https://mcm1cxutqk.execute-api.ap-southeast-2.amazonaws.com/preprod/',
      changeOrigin: true,
      pathRewrite: {
        '^/api': ''
      }
    })
  );
};
