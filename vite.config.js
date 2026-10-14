import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.png', 'apple-touch-icon.png', 'brand/logo.webp', 'brand/logo-160.webp'],
      manifest: {
        name: 'Associação Cultural e Ambiental Chico Mendes',
        short_name: 'Chico Mendes',
        description: 'Preservar a natureza é preservar vidas. Viveiro, Ponto de Cultura e creche no Cabuçu, Guarulhos/SP.',
        lang: 'pt-BR',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        background_color: '#fbfaf6',
        theme_color: '#1b4a26',
        icons: [
          { src: '/pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        // PDFs da transparência ficam fora do cache inicial (são grandes);
        // são guardados conforme o visitante abre cada um.
        globPatterns: ['**/*.{js,css,html,webp,png,woff2,webmanifest}'],
        globIgnores: ['**/brand/logo-original.png', '**/*cyrillic*', '**/*greek*', '**/*vietnamese*'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
        navigateFallback: '/index.html',
        navigateFallbackDenylist: [/^\/docs\//],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.hostname === 'static.wixstatic.com',
            handler: 'CacheFirst',
            options: { cacheName: 'fotos', expiration: { maxEntries: 120, maxAgeSeconds: 60 * 60 * 24 * 60 } }
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith('/docs/'),
            handler: 'CacheFirst',
            options: { cacheName: 'transparencia', expiration: { maxEntries: 30 } }
          }
        ]
      }
    })
  ],
  // Pré-empacota as dependências na inicialização do servidor de desenvolvimento.
  // Sem isso, o Vite as descobre ao abrir uma página pela primeira vez, reinicia
  // e o navegador fica com links antigos ("Failed to fetch dynamically imported module").
  optimizeDeps: {
    entries: ['index.html', 'src/**/*.jsx'],
    include: ['react', 'react-dom', 'react-dom/client', 'react-router-dom', 'qrcode', 'three', '@react-three/fiber', '@react-three/drei']
  },
  build: {
    target: 'es2020',
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          r3f: ['@react-three/fiber', '@react-three/drei'],
          react: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
