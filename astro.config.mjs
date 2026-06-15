// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

// Atualize 'site' para o domínio final quando publicar (ex.: https://vortice.blog)
export default defineConfig({
  site: process.env.SITE_URL || 'https://vortice.exemplo.com',
  output: 'server',
  adapter: vercel(),
  integrations: [sitemap()],
});
