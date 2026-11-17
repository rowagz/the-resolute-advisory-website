// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// Static build → ./dist, served by the Cloudflare Worker (see wrangler.jsonc).
export default defineConfig({
  site: 'https://theresoluteadvisory.com',
  output: 'static',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
