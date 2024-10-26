import fs from 'fs';
import path from 'path';
import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const metaDir = path.resolve(process.cwd(), '..', '..', '__data__', 'meta');
const movieIds = fs.existsSync(metaDir) ? fs.readdirSync(metaDir).map((f) => path.parse(f).name) : [];

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: vitePreprocess(),

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported, or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    adapter: adapter({ fallback: '404.html' }),
    paths: {
      base: process.argv.includes('dev') ? '' : process.env.BASE_PATH,
    },
    prerender: {
      entries: ['/', '/my-list', '/request', '/request/err', '/request/ok', '/search', ...movieIds.map((id) => `/subtitles/${id}`)],
    },
  },
};

export default config;
