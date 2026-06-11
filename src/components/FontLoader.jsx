import { useEffect } from 'react'

export default function FontLoader() {
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Pinyon+Script&family=Tajawal:wght@400;500;700;900&family=Inter:wght@400;600;700&display=swap'
    document.head.appendChild(link)
    return () => { try { document.head.removeChild(link) } catch {} }
  }, [])
  return null
}
