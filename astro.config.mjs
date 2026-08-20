// @ts-check
import { defineConfig, passthroughImageService } from 'astro/config';

import vercel from '@astrojs/vercel';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: vercel(),
  integrations: [react()],
  // Nothing here needs resizing or reformatting — the glossary emoji are
  // hand-sized PNGs. Passthrough keeps astro:assets (and its build-time
  // intrinsic dimensions) without pulling in Sharp.
  image: { service: passthroughImageService() },
});