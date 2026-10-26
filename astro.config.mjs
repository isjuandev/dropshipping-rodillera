import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: process.env.PUBLIC_DOMINIO || 'https://viralyshop.co',
  output: 'static',
  integrations: [
    preact({
      compat: true,
    }),
    sitemap({
      filter: (page) => !page.includes('/gracias'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
