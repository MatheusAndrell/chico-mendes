import React from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/nunito'
import '@fontsource-variable/nunito-sans'
import './presentation/styles/global.css'
import App from './app/App'

// O site não é um PWA. Quem visitou uma versão anterior pode ter um service
// worker instalado: ele é removido aqui, junto com os caches que ele criou.
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => regs.forEach((r) => r.unregister()))
  if (window.caches) caches.keys().then((keys) => keys.forEach((k) => caches.delete(k)))
}

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
