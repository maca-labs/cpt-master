import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
const pagesBuild = process.env.GITHUB_PAGES === 'true';
const base = pagesBuild ? '/cpt-master/' : '/';
export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      injectRegister: 'auto',
      manifest: {
        name: 'CPT Master',
        short_name: 'CPT Master',
        lang: 'ja',
        description: '理解から、指導できる知識へ。NSCA-CPT個人学習ノート',
        theme_color: '#f5f7f4',
        background_color: '#f5f7f4',
        display: 'standalone',
        start_url: base,
        scope: base,
        id: base,
        icons: [
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
        ],
      },
      workbox: { globPatterns: ['**/*.{js,css,html,svg,png}'], navigateFallback: 'index.html' },
    }),
  ],
  server: { port: 5173, strictPort: true },
  build: {
    outDir: pagesBuild ? 'dist-pages' : 'dist',
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
