import { useCallback, useEffect, useRef, useState } from 'react'

export function useCopy(timeout = 1800) {
  const [copied, setCopied] = useState(false)
  const timer = useRef()
  useEffect(() => () => clearTimeout(timer.current), [])
  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text)
      } catch {
        const t = document.createElement('textarea')
        t.value = text
        document.body.appendChild(t)
        t.select()
        document.execCommand('copy')
        t.remove()
      }
      setCopied(true)
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setCopied(false), timeout)
    },
    [timeout]
  )
  return [copied, copy]
}
