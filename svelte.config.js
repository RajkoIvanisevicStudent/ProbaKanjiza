// import adapter from '@sveltejs/adapter-auto';
// import adapter from '@sveltejs/adapter-static';
// import adapter from '@sveltejs/adapter-node';
import azure from 'svelte-adapter-azure-swa';

/** @type {import('@sveltejs/kit').Config} */
// const config = {
// 	kit: {
// 		// adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
// 		// If your environment is not supported or you settled on a specific environment, switch out the adapter.
// 		// See https://kit.svelte.dev/docs/adapters for more information about adapters.
// 		// adapter: adapter(),
// 		 adapter: adapter(),
// 		// adapter: adapter({
// 		// 	fallback: '200.html' // may differ from host to host
// 		// })
// 		// adapter: adapter({
// 		// 	// default options are shown. On some platforms
// 		// 	// these options are set automatically — see below
// 		// 	pages: 'build',
// 		// 	assets: 'build',
// 		// 	fallback: '200.html', // may differ from host to host,
// 		// 	precompress: false,
// 		// 	strict: true
// 		// })
// 		// csrf: false
// 	}
// };

// export default config;

// export default {
// 	kit: {
// 		adapter: adapter({
// 			// default options are shown
// 			out: 'build',
// 			precompress: false,
// 			envPrefix: '',
// 			polyfill: false
// 		})
// 	}
// };

export default {
	kit: {
		adapter: azure({
			allowReservedSwaRoutes: true
		
		})
	}
};