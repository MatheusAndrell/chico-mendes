import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/nunito'
import '@fontsource-variable/nunito-sans'
import './presentation/styles/global.css'
import App from './app/App'

if (import.meta.env.PROD) {
  // PWA (cache offline) só no site publicado
  import('virtual:pwa-register').then(({ registerSW }) => registerSW({ immediate: true }))
} else if ('serviceWorker' in navigator) {
  // Em desenvolvimento, remove service workers e caches de versões antigas
  // que possam estar servindo arquivos desatualizados em localhost.
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()))
  if (window.caches) caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
