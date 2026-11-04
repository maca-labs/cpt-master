import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
export default defineConfig({
  base: process.env.GITHUB_PAGES === 'true' ? '/cpt-master/' : '/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      manifest: {
        name: 'CPT Master',
        short_name: 'CPT Master',
        lang: 'ja',
        description: '理解から、指導できる知識へ。NSCA-CPT個人学習ノート',
        theme_color: '#f5f7f4',
        background_color: '#f5f7f4',
        display: 'standalone',
        icons: [{ src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg}'], navigateFallback: 'index.html' },
    }),
  ],
  server: { port: 5173, strictPort: true },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom'],
          storage: ['dexie', 'zod'],
        },
      },
    },
  },
  test: { environment: 'node', include: ['tests/**/*.test.ts'] },
} as import('vite').UserConfig);
