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
      <div id="catalogue" style={{ background: '#F7F5F2', padding: '44px 0 0' }}>
        <div style={{ maxWidth: 780, margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginBottom: 24, flexWrap: 'wrap', gap: 10 }}>
            <h2 style={{ fontFamily: 'Inter,sans-serif', fontSize: 13, fontWeight: 700,
              letterSpacing: 3, color: '#888' }}>
              {filter === 'TOUS' ? tr.collection : filter}
            </h2>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {CATS.map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '6px 13px', fontSize: 11, fontFamily: 'Inter,sans-serif',
                    fontWeight: 600, background: filter === f ? '#1a1a1a' : 'transparent',
                    color: filter === f ? 'white' : '#999',
                    border: `1px solid ${filter === f ? '#1a1a1a' : '#ddd'}`,
                    borderRadius: 20, cursor: 'pointer', letterSpacing: .5,
                    transition: 'all .2s' }}>
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, padding: '0 3px' }}>
          {filtered.map(p => (
            <div key={p.id} onClick={() => onProduct(p.slug)}
              style={{ cursor: 'pointer', background: 'white',
                borderRadius: 12, overflow: 'hidden',
                boxShadow: '0 2px 12px rgba(0,0,0,.06)',
                transition: 'transform .25s, box-shadow .25s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,.1)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,.06)' }}>
              <div style={{ overflow: 'hidden', background: '#F0ECE6', aspectRatio: '1/1' }}>
                <img src={p.imgs[0]} alt={p.nom.fr} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                    transition: 'transform .5s' }}
                  onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform = 'scale(1)'} />
              </div>
              <div style={{ padding: '12px 12px 14px' }}>
                <div style={{ fontSize: 9, letterSpacing: 2, color: '#bbb',
                  fontFamily: 'Inter,sans-serif', fontWeight: 700, marginBottom: 4 }}>
                  {p.cat[lang] || p.cat.fr}
                </div>
                <div style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 13,
                  color: '#1a1a1a', marginBottom: 6, lineHeight: 1.3 }}>
                  {p.nom[lang] || p.nom.fr}
                </div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <span style={{ fontSize: 13, fontWeight: 800, fontFamily: 'Inter,sans-serif',
                    color: C.T }}>
                    {p.prix} {tr.currency}
                  </span>
                  {p.old && (
                    <span style={{ fontSize: 11, color: '#ccc', textDecoration: 'line-through',
                      fontFamily: 'Inter,sans-serif' }}>
                      {p.old}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ height: 40 }} />
      </div>

      {/* ARTISAN BLOCK */}
      <div style={{ background: '#3D2310', margin: '44px 0 0', padding: '44px 20px' }}>
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
            alt="Artisan" loading="lazy" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
        </div>
      </div>

      {/* FOOTER */}
      <footer style={{ background: '#2C1A0E', padding: '36px 20px 20px' }}>
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
