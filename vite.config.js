import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  assetsInclude: ['**/*.glsl', '**/*.vert', '**/*.frag'],
  optimizeDeps: {
    include: ['three']
  },
  server: {
    fs: {
      allow: ['..']
    }
  }
}); 