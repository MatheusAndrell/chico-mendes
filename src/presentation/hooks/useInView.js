import { useEffect, useRef, useState } from 'react'

/** true enquanto o elemento estiver (perto de estar) visível */
export function useInView(rootMargin = '200px') {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return setInView(true)
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return [ref, inView]
}
