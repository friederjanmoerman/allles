// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  resolve: {
    alias: {
      'three': 'node_modules/three/build/three.module.js', // Ensure correct path for three.js
    },
  },
});

