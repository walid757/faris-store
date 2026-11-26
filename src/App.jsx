import React, { useState, useEffect } from 'react'
import HomePage    from './pages/HomePage.jsx'
import ProductPage from './pages/ProductPage.jsx'
import AdminPage   from './pages/AdminPage.jsx'
import FontLoader  from './components/FontLoader.jsx'
import ThemeLuxe   from './themes/ThemeLuxe.jsx'
import ThemeFlash  from './themes/ThemeFlash.jsx'
import ThemeStory  from './themes/ThemeStory.jsx'
import ThemeFassi  from './themes/ThemeFassi.jsx'
import LandingStephano from './pages/LandingStephano.jsx'
import LpRotator from './pages/LpRotator.jsx'
import LandingGS099, { GS_CAMPAIGN, GS_PAGE_IDS, GS_MIX } from './pages/LandingGS099.jsx'
import LpRotator2 from './pages/LpRotator2.jsx'
import LandingM26, { M26_MODELS, M26_PAGE_IDS, M26_CAMPAIGN } from './pages/LandingM26.jsx'

// ── SIMPLE ROUTER ─────────────────────────────────────────────
const getPage = () => {
  const hash = window.location.hash
  if (hash === '#admin')           return 'admin'
  if (hash.startsWith('#produit')) return 'product'
  if (hash.startsWith('#lp/'))     return 'lp'
  if (hash === '#test')            return 'lptest'
  if (hash.startsWith('#gs/'))     return 'gs'
  if (hash === '#gs-ar' || hash === '#gs-fr') return 'gsrot'
  if (hash === '#gs099')           return 'gsmixrot'
  if (hash.startsWith('#gsm/'))    return 'gsmix'
  if (Object.prototype.hasOwnProperty.call(M26_MODELS, hash.slice(1))) return 'm26rot'
  if (hash.startsWith('#m26/'))    return 'm26'
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

  if (page === 'lptest') return <LpRotator />

  if (page === 'gsrot') {
    const gl = window.location.hash === '#gs-fr' ? 'fr' : 'ar'
    return <LpRotator2 key={gl} campaign={GS_CAMPAIGN[gl]} base={'#gs/' + gl + '/'} ids={GS_PAGE_IDS} />
  }

  if (page === 'gsmixrot') return <LpRotator2 key="mix" campaign={GS_MIX.campaign} base="#gsm/" ids={GS_MIX.ids} />

  if (page === 'gsmix') {
    const gid = window.location.hash.replace('#gsm/', '').slice(0, 3)
    return <LandingGS099 key={'mix' + gid} set="mix" id={gid} />
  }

  if (page === 'm26rot') {
    const mm = window.location.hash.slice(1)
    return <LpRotator2 key={mm} campaign={M26_CAMPAIGN(mm)} base={'#m26/' + mm + '/'} ids={M26_PAGE_IDS} />
  }

  if (page === 'm26') {
    const [, mm, mid] = window.location.hash.split('/')
    return <LandingM26 key={mm + mid} model={mm} id={(mid || '').slice(0, 3)} />
  }

  if (page === 'gs') {
    const [, gl, gid] = window.location.hash.split('/')
    return <LandingGS099 key={gl + gid} lang={gl} id={(gid || '').slice(0, 2)} />
  }

  if (page === 'lp') return <LandingStephano id={window.location.hash.replace('#lp/', '').slice(0, 2)} />

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
