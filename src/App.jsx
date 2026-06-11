import React, { useState, useEffect } from 'react'
import HomePage from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import FontLoader from './components/FontLoader.jsx'

// ── SIMPLE ROUTER ─────────────────────────────────────────────
const getPage = () => {
  const hash = window.location.hash
  if (hash === '#admin')           return 'admin'
  if (hash.startsWith('#produit')) return 'product'
  return 'home'
}

const getSlug = () => window.location.hash.replace('#produit/', '')

export default function App() {
  const [page, setPage]   = useState(getPage())
  const [slug, setSlug]   = useState(getSlug())
  const [lang, setLang]   = useState('fr') // 'fr' | 'ar'

  useEffect(() => {
    const onHash = () => {
      setPage(getPage())
      setSlug(getSlug())
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Track page view
  useEffect(() => {
    fetch('/api/stats/visit', { method: 'POST' }).catch(() => {})
  }, [page])

  const nav = {
    home:    () => { window.location.hash = ''; setPage('home') },
    product: (s) => { window.location.hash = '#produit/' + s; setPage('product'); setSlug(s) },
    admin:   () => { window.location.hash = '#admin'; setPage('admin') }
  }

  if (page === 'admin') return <><FontLoader/><AdminPage onBack={nav.home} /></>

  if (page === 'product') return (
    <ProductPage
      slug={slug || 'rbati'}
      lang={lang}
      onLangToggle={() => setLang(l => l === 'fr' ? 'ar' : 'fr')}
      onBack={nav.home}
    />
  )

  return (
    <HomePage
      lang={lang}
      onLangToggle={() => setLang(l => l === 'fr' ? 'ar' : 'fr')}
      onProduct={nav.product}
      onAdmin={nav.admin}
    />
  )
}
