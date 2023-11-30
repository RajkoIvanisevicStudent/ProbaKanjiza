// import { sveltekit } from '@sveltejs/kit/vite';
// import { defineConfig } from 'vite';
// import { proxy } from './proxy.js';
// export default defineConfig({
// 	plugins: [sveltekit()],

// });


import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
// // import { createProxyMiddleware } from 'http-proxy-middleware'; // Import the middleware directly

// // Your proxy configuration
// const proxyMiddleware = createProxyMiddleware('/api', {
//   target: 'http://100.96.1.7:8009', // Your API server's address
//   changeOrigin: true,
// });

export default defineConfig({
  plugins: [sveltekit()],
//   devServer: {
//     proxy: {
//       '/api': 'http://100.96.1.7:8009',
//     },
//   },
//   server: {
// 	proxy: {
// 		'/api': {
// 			target: 'http://[::1]:8080',
// 			rewrite: (path) => path.replace(/^\/api/, ''),
// 			changeOrigin: true
// 		}
// 	}
// }
//   server: {
// 	fs: {
// 		strict: false
// 	}
// }
//   server: {
//     proxy: {
//       '/api': 'http://100.96.1.7:8009'
//     }
//   },
//   // Include the proxy middleware in the server options
//   server: {
//     middleware: [proxyMiddleware],
//   },
});

