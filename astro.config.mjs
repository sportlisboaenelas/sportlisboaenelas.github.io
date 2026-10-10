import { defineConfig } from 'astro/config';

// Site 100% estático. O Cloudflare serve a pasta "dist".
export default defineConfig({
  output: 'static',
});
