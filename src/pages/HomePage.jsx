import React, { useState, useRef, useEffect } from 'react'
import { Marquee, Header, Stars, WhatsApp, Toast, COLORS as C } from '../components/Shared.jsx'
import { PRODUCTS } from '../data/products.js'
import { t } from '../data/translations.js'

const CATS = ['TOUS','MOCASSINS','LACETS','SNEAKERS','CHELSEA']

export default function HomePage({ lang = 'fr', onLangToggle, onProduct, onAdmin }) {
  const [filter, setFilter]     = useState('TOUS')
  const [slide,  setSlide]      = useState(0)
  const [toast,  setToast]      = useState('')
  const [logoN,  setLogoN]      = useState(0)
  const logoTimer                = useRef(null)
  const tr                       = t(lang)

  const HERO_IMGS = [
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=1200&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=1200&q=80',
    'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=1200&q=80',
  ]

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % HERO_IMGS.length), 4500)
    return () => clearInterval(id)
  }, [])

  const toast$ = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500) }

  const handleLogo = () => {
    const n = logoN + 1
    setLogoN(n)
    clearTimeout(logoTimer.current)
    logoTimer.current = setTimeout(() => setLogoN(0), 2000)
    if (n >= 5) { setLogoN(0); onAdmin() }
  }

  const filtered = filter === 'TOUS' ? PRODUCTS : PRODUCTS.filter(p =>
    p.cat.fr.includes(filter) || p.cat.ar.includes(filter)
  )

  const AF = { fontFamily: tr.font, direction: tr.dir }

  return (
    <div style={{ ...AF, background: 'white', color: C.DK, maxWidth: 780, margin: '0 auto' }}>
      <Toast msg={toast} />
      <Marquee lang={lang} />
      <Header lang={lang} onHome={() => {}} onLogoClick={handleLogo}
        onLangToggle={onLangToggle} />

      {/* HERO */}
      <div style={{ position: 'relative', height: '85vh', overflow: 'hidden' }}>
        {HERO_IMGS.map((src, i) => (
          <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === slide ? 1 : 0,
            transition: 'opacity .7s ease', pointerEvents: i === slide ? 'auto' : 'none' }}>
            <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover',
              objectPosition: 'center', display: 'block' }} />
          </div>
        ))}
        <div style={{ position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom,rgba(0,0,0,.1),rgba(0,0,0,.55))' }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '0 7%' }}>
          <h1 style={{ fontFamily: 'Georgia,serif', fontSize: 'clamp(32px,8vw,68px)',
            color: 'white', lineHeight: 1.05, marginBottom: 16, fontWeight: 600 }}>
            {tr.heroTitle}
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.75)', marginBottom: 26,
            fontFamily: tr.font, lineHeight: 1.7, maxWidth: 380 }}>
            {tr.heroSub}
          </p>
          <button onClick={() => document.getElementById('catalogue')?.scrollIntoView({ behavior: 'smooth' })}
            style={{ padding: '12px 26px', background: 'white', color: C.DK, fontSize: 12,
              fontFamily: 'Inter,sans-serif', fontWeight: 700, border: 'none', cursor: 'pointer',
              alignSelf: 'flex-start', letterSpacing: 1.5 }}>
            {tr.heroBtn}
          </button>
        </div>
        {/* Dots */}
        <div style={{ position: 'absolute', bottom: 60, left: 0, right: 0,
          display: 'flex', justifyContent: 'center', gap: 5 }}>
          {HERO_IMGS.map((_, i) => (
            <div key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 18 : 5,
              height: 5, background: i === slide ? 'white' : 'rgba(255,255,255,.45)',
              borderRadius: 3, cursor: 'pointer', transition: 'all .3s' }} />
          ))}
        </div>
        {/* Stats bar */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(0,0,0,.55)', backdropFilter: 'blur(8px)',
          display: 'flex', justifyContent: 'space-around', padding: '14px 20px' }}>
          {tr.stats.map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center', color: 'white' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: C.GD,
                fontFamily: 'Inter,sans-serif' }}>{v}</div>
              <div style={{ fontSize: 10, opacity: .7, fontFamily: tr.font }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CATALOGUE */}
      <div id="catalogue" style={{ maxWidth: 780, margin: '0 auto', padding: '44px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <h2 style={{ fontFamily: 'Georgia,serif', fontSize: 24, fontWeight: 600 }}>
            {filter === 'TOUS' ? tr.collection : filter}
          </h2>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {CATS.map(f => (
              <button key={f} onClick={() => setFilter(f)}
                style={{ padding: '5px 11px', fontSize: 11, fontFamily: 'Inter,sans-serif',
                  fontWeight: 600, background: filter === f ? C.DK : 'white',
                  color: filter === f ? 'white' : '#666',
                  border: `1px solid ${filter === f ? C.DK : '#ddd'}`,
                  cursor: 'pointer', letterSpacing: .5 }}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => onProduct(p.slug)}
              style={{ cursor: 'pointer', marginBottom: 22 }}>
              <div style={{ overflow: 'hidden', background: '#f0ede8', aspectRatio: '3/4' }}>
                <img src={p.imgs[0]} alt={p.nom.fr}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transition: 'transform .5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              </div>
              <div style={{ paddingTop: 9 }}>
                <div style={{ fontSize: 10, letterSpacing: 2, color: '#aaa',
                  fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>
                  {p.cat[lang] || p.cat.fr}
                </div>
                <div style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: 19,
                  color: C.T, marginTop: 2 }}>
                  {p.nom[lang] || p.nom.fr}
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'baseline' }}>
                  <span style={{ fontSize: 14, fontWeight: 700, fontFamily: 'Inter,sans-serif' }}>
                    {p.prix} {tr.currency}
                  </span>
                  {p.old && (
                    <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through',
                      fontFamily: 'Inter,sans-serif' }}>
                      {p.old}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ARTISAN BLOCK */}
      <div style={{ background: '#2d2010', margin: '44px 0 0', padding: '44px 20px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', display: 'grid',
          gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: 9, letterSpacing: 3, color: 'rgba(255,255,255,.4)',
              fontFamily: 'Inter,sans-serif', fontWeight: 600, marginBottom: 12 }}>
              {lang === 'fr' ? 'NOTRE ADN' : 'هويتنا'}
            </div>
            <h3 style={{ fontFamily: 'Georgia,serif', fontSize: 22, color: 'white',
              lineHeight: 1.3, marginBottom: 12, fontStyle: 'italic' }}>
              {lang === 'fr'
                ? "Les tanneries de Fès, vivantes depuis le XIe siècle."
                : "تانوريات فاس، حية منذ القرن الحادي عشر."}
            </h3>
            <p style={{ fontFamily: tr.font, fontSize: 13, color: 'rgba(255,255,255,.6)',
              lineHeight: 1.8 }}>
              {lang === 'fr'
                ? "Cuir tanné végétalement, artisans qualifiés, savoir-faire ancestral."
                : "جلد مدبوغ نباتياً، حرفيون متخصصون، خبرة متوارثة."}
            </p>
            <div style={{ fontSize: 9, letterSpacing: 3, color: C.GD, fontFamily: 'Inter,sans-serif',
              fontWeight: 700, borderTop: '1px solid rgba(255,255,255,.1)',
              paddingTop: 12, marginTop: 14 }}>
              {lang === 'fr' ? 'FAIT AU MAROC' : 'صنع في المغرب'}
            </div>
          </div>
          <img src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80"
            alt="Artisan" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#111', padding: '36px 20px 20px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto' }}>
          <div style={{ fontFamily: "'Pinyon Script',cursive", fontSize: 28, color: 'white',
            marginBottom: 4, textAlign: 'center' }}>Faris</div>
          <div style={{ fontSize: 7, letterSpacing: 4, color: 'rgba(255,255,255,.3)',
            fontFamily: 'Inter,sans-serif', textAlign: 'center', marginBottom: 20,
            fontWeight: 600 }}>
            {tr.cuirMarocain}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 16,
            display: 'flex', justifyContent: 'space-between', fontSize: 11,
            fontFamily: 'Inter,sans-serif', color: 'rgba(255,255,255,.3)',
            flexWrap: 'wrap', gap: 8 }}>
            <span>© 2025 Faris · Tous droits réservés</span>
            <span>Visa · Mastercard · CMI · Cash</span>
          </div>
        </div>
      </footer>

      <WhatsApp lang={lang} />
    </div>
  )
}
