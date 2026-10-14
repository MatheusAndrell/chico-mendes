import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
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
