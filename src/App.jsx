import React, { useState, useEffect } from 'react'
import HomePage    from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import AdminPage   from './pages/AdminPage.jsx'
import FontLoader  from './components/FontLoader.jsx'
import ThemeLuxe   from './themes/ThemeLuxe.jsx'
import ThemeFlash  from './themes/ThemeFlash.jsx'
import ThemeStory  from './themes/ThemeStory.jsx'
import ThemeFassi  from './themes/ThemeFassi.jsx'

// ── SIMPLE ROUTER ─────────────────────────────────────────────
const getPage = () => {
  const hash = window.location.hash
  if (hash === '#admin')           return 'admin'
  if (hash.startsWith('#produit')) return 'product'
  return 'home'
}

const getSlug = () => window.location.hash.replace('#produit/', '')

const THEMES = { luxe: ThemeLuxe, flash: ThemeFlash, story: ThemeStory, fassi: ThemeFassi }

export default function App() {
  const [page,  setPage]  = useState(getPage())
  const [slug,  setSlug]  = useState(getSlug())
  const [lang,  setLang]  = useState('fr')
  const [theme, setTheme] = useState('original')

  useEffect(() => {
    const onHash = () => { setPage(getPage()); setSlug(getSlug()) }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Track page view
  useEffect(() => {
    fetch('/api/stats/visit', { method: 'POST' }).catch(() => {})
  }, [page])

  // Fetch active theme from server config
  useEffect(() => {
    fetch('/api/config')
      .then(r => r.json())
      .then(cfg => { if (cfg.theme) setTheme(cfg.theme) })
      .catch(() => {})
  }, [])

  const nav = {
    home:    () => { window.location.hash = ''; setPage('home') },
    product: (s) => { window.location.hash = '#produit/' + s; setPage('product'); setSlug(s) },
    admin:   () => { window.location.hash = '#admin'; setPage('admin') }
  }

  const langProps = {
    lang,
    onLangToggle: () => setLang(l => l === 'fr' ? 'ar' : 'fr')
  }

  if (page === 'admin') return <><FontLoader/><AdminPage onBack={nav.home} onThemeChange={setTheme} /></>

  if (page === 'product') return (
    <ProductPage
      slug={slug || 'rbati'}
      {...langProps}
      onBack={nav.home}
    />
  )

  // Home — render selected theme or original catalog
  const ThemeComponent = THEMES[theme]
  if (ThemeComponent) return (
    <>
      <FontLoader />
      <ThemeComponent {...langProps} onProduct={nav.product} onAdmin={nav.admin} />
    </>
  )

  return (
    <HomePage
      {...langProps}
      onProduct={nav.product}
      onAdmin={nav.admin}
    />
  )
}
