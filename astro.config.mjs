// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';

// https://astro.build/config
export default defineConfig({
  site: 'https://itsmail.dev',
  output: 'server',
  adapter: cloudflare(),
  redirects: {
    '/blog': '/notes',
    '/blog/[...slug]': '/notes/[...slug]',
  },
  vite: {
    server: {
      allowedHosts: ['.ngrok-free.app'],
    },
  },
});
