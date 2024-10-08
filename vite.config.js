import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    // This ensures Vite serves `index.html` for unknown routes, letting the client-side router handle them
    historyApiFallback: true
  }
});