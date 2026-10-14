import { useEffect, useState } from 'react'

export function useInstallPrompt() {
  const [evt, setEvt] = useState(null)
  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setEvt(e)
    }
    const onInstalled = () => setEvt(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])
  const install = async () => {
    if (!evt) return
    evt.prompt()
    await evt.userChoice
    setEvt(null)
  }
  return { canInstall: !!evt, install }
}
