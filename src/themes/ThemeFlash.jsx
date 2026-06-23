import React, { useState, useEffect, useRef } from 'react'
import { PRODUCTS } from '../data/products.js'
import OrderForm from './_OrderForm.jsx'

const P = PRODUCTS[0]

const C = {
  red:    '#dc2626',
  redDk:  '#991b1b',
  amber:  '#f59e0b',
  bg:     '#ffffff',
  bg2:    '#fff7f7',
  dark:   '#111111',
  muted:  '#6b7280',
  border: '#e5e7eb',
}

const FORM_STYLE = {
  inputBg:     '#fff',
  borderColor: '#e5e7eb',
  accentColor: C.red,
  textColor:   C.dark,
  mutedColor:  C.muted,
  btnBg:       C.red,
  btnText:     '#fff',
  cardBg:      '#fff',
}

function useCountdown() {
  const [time, setTime] = useState({ h: 0, m: 0, s: 0 })
  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const midnight = new Date()
      midnight.setHours(23, 59, 59, 0)
      const diff = midnight - now
      setTime({
        h: Math.floor(diff / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000)
      })
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return time
}

const REVIEWS = [
  { name: 'Karim B.', city: 'Casablanca', stars: 5, text: 'Qualité exceptionnelle, exactement comme sur les photos. Livraison en 2 jours !' },
  { name: 'Yasmine M.', city: 'Rabat', stars: 5, text: 'Magnifique paire, le cuir est vraiment premium. Je recommande vivement.' },
  { name: 'Hamid R.', city: 'Fès', stars: 5, text: 'Confortable dès le premier port. Le vrai artisanat fassi, ça se sent.' },
]

export default function ThemeFlash({ lang, onLangToggle, onProduct }) {
  const { h, m, s } = useCountdown()
  const [stock]     = useState(4)
  const formRef     = useRef(null)
  const isAr = lang === 'ar'
  const dir  = isAr ? 'rtl' : 'ltr'
  const font = isAr ? 'Tajawal, sans-serif' : 'Inter, sans-serif'

  const T = isAr ? {
    banner:   '🔥 عرض محدود — ينتهي اليوم!',
    stock:    `⚠️ ${stock} أزواج فقط متبقية في المخزون`,
    save:     `وفّر ${P.old - P.prix} درهم اليوم فقط`,
    cta:      `اطلب الآن — ${P.prix} درهم`,
    ctaOld:   `كان ${P.old} درهم`,
    catalog:  'المنتجات',
    timer:    'ينتهي العرض خلال:',
    h: 'س', m: 'د', s: 'ث',
    reviews:  'آراء الزبائن',
    whyTitle: 'لماذا تختار فارس؟',
    why: ['🌿 جلد طبيعي 100%', '✋ صنع يدوياً في فاس', '🚚 توصيل 24-48 ساعة', '💳 دفع عند الاستلام', '🛡️ ضمان سنتين', '↩️ إرجاع خلال 14 يوماً'],
  } : {
    banner:   '🔥 OFFRE LIMITÉE — Se termine ce soir !',
    stock:    `⚠️ Plus que ${stock} paires disponibles`,
    save:     `Économisez ${P.old - P.prix} MAD aujourd'hui seulement`,
    cta:      `Commander maintenant — ${P.prix} MAD`,
    ctaOld:   `était ${P.old} MAD`,
    catalog:  'Catalogue',
    timer:    "L'offre expire dans :",
    h: 'h', m: 'min', s: 'sec',
    reviews:  'Avis clients',
    whyTitle: 'Pourquoi choisir Faris ?',
    why: ['🌿 Cuir naturel 100%', '✋ Fait à la main à Fès', '🚚 Livraison 24-48h', '💳 Paiement livraison', '🛡️ Garantie 2 ans', '↩️ Retours 14 jours'],
  }

  const pad = n => String(n).padStart(2, '0')

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.dark, direction: dir, fontFamily: font }}>

      {/* ── TOP BANNER ── */}
      <div style={{ background: C.red, color: 'white', textAlign: 'center',
        padding: '10px 16px', fontSize: 13, fontWeight: 700 }}>
        {T.banner}
      </div>

      {/* ── HEADER ── */}
      <header style={{ background: 'white', borderBottom: `2px solid ${C.border}`,
        padding: '12px 18px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 26, color: C.dark, lineHeight: 1 }}>
          Faris
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onProduct('rbati')}
            style={{ background: 'none', border: `1px solid ${C.border}`, borderRadius: 8,
              padding: '6px 12px', fontSize: 12, color: C.muted, cursor: 'pointer', fontFamily: font }}>
            {T.catalog}
          </button>
          <button onClick={onLangToggle}
            style={{ background: C.dark, border: 'none', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, color: 'white', cursor: 'pointer',
              fontFamily: font, fontWeight: 700 }}>
            {isAr ? 'FR' : 'عربي'}
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ padding: '20px 18px', maxWidth: 780, margin: '0 auto' }}>

        {/* Countdown */}
        <div style={{ background: C.bg2, border: `2px solid ${C.red}`, borderRadius: 14,
          padding: '14px 18px', marginBottom: 18, textAlign: 'center' }}>
          <div style={{ fontSize: 12, color: C.muted, marginBottom: 8, fontWeight: 600 }}>{T.timer}</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center' }}>
            {[[pad(h), T.h], [pad(m), T.m], [pad(s), T.s]].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ background: C.red, color: 'white', borderRadius: 10,
                  padding: '12px 16px', fontSize: 28, fontWeight: 900, minWidth: 56,
                  fontFamily: 'monospace' }}>
                  {val}
                </div>
                <div style={{ fontSize: 10, color: C.muted, marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Product image + info */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <img src={P.imgs[0]} alt={P.nom.fr}
            style={{ width: '100%', borderRadius: 16, display: 'block', aspectRatio: '4/3', objectFit: 'cover' }} />
          {P.old && (
            <div style={{ position: 'absolute', top: 12, insetInlineStart: 12,
              background: C.red, color: 'white', borderRadius: 50, padding: '6px 14px',
              fontSize: 13, fontWeight: 900 }}>
              -{Math.round((1 - P.prix/P.old)*100)}%
            </div>
          )}
          <div style={{ position: 'absolute', top: 12, insetInlineEnd: 12,
            background: C.amber, color: 'white', borderRadius: 50, padding: '6px 14px',
            fontSize: 11, fontWeight: 700 }}>
            {T.stock.replace('⚠️ ','')}
          </div>
        </div>

        {/* Price */}
        <div style={{ marginBottom: 14, padding: '14px 16px', background: C.bg2,
          border: `1px solid ${C.border}`, borderRadius: 12 }}>
          <div style={{ fontSize: 12, color: C.red, fontWeight: 700, marginBottom: 4 }}>{T.stock}</div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: C.red }}>{P.prix} MAD</span>
            {P.old && (
              <span style={{ textDecoration: 'line-through', color: C.muted, fontSize: 18 }}>{P.old} MAD</span>
            )}
          </div>
          {P.old && <div style={{ fontSize: 13, color: C.amber, fontWeight: 700, marginTop: 2 }}>{T.save}</div>}
        </div>

        {/* CTA Button */}
        <button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          style={{ width: '100%', padding: '18px', background: C.red, color: 'white',
            fontSize: 17, fontWeight: 900, border: 'none', borderRadius: 14, cursor: 'pointer',
            fontFamily: font, marginBottom: 8, letterSpacing: 0.5 }}>
          {T.cta}
        </button>
        <div style={{ textAlign: 'center', fontSize: 12, color: C.muted, marginBottom: 24 }}>
          🛡️ {isAr ? 'دفع آمن عند الاستلام' : 'Paiement sécurisé à la livraison'}
        </div>

        {/* Order Form */}
        <div ref={formRef} style={{ background: '#fafafa', border: `1.5px solid ${C.red}20`,
          borderRadius: 16, padding: '20px 16px', marginBottom: 28 }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: C.dark, marginBottom: 16,
            textAlign: 'center', textTransform: 'uppercase', letterSpacing: 1 }}>
            {isAr ? '📦 أدخل بيانات الطلب' : '📦 Vos informations de livraison'}
          </div>
          <OrderForm product={P} lang={lang} S={FORM_STYLE} />
        </div>

        {/* Why choose */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, textAlign: 'center' }}>{T.whyTitle}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8 }}>
            {T.why.map(w => (
              <div key={w} style={{ background: C.bg2, border: `1px solid ${C.border}`,
                borderRadius: 10, padding: '10px 12px', fontSize: 12, color: C.dark }}>
                {w}
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 14, textAlign: 'center' }}>
            ⭐ {T.reviews}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ background: '#fffbf0', border: `1px solid #fde68a`,
                borderRadius: 12, padding: '14px 16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>{r.name}</span>
                  <span style={{ fontSize: 11, color: C.muted }}>{r.city}</span>
                </div>
                <div style={{ color: C.amber, fontSize: 13, marginBottom: 6 }}>{'★'.repeat(r.stars)}</div>
                <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.5 }}>{r.text}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STICKY CTA ── */}
      <div style={{ position: 'sticky', bottom: 0, background: 'white',
        borderTop: `2px solid ${C.red}`, padding: '12px 18px', zIndex: 90 }}>
        <button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          style={{ width: '100%', maxWidth: 780, display: 'block', margin: '0 auto',
            padding: '15px', background: C.red, color: 'white', fontSize: 15,
            fontWeight: 900, border: 'none', borderRadius: 12, cursor: 'pointer', fontFamily: font }}>
          {T.cta}
        </button>
      </div>

      <footer style={{ padding: '20px 18px', textAlign: 'center', borderTop: `1px solid ${C.border}` }}>
        <div style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 24, color: C.dark, marginBottom: 4 }}>Faris</div>
        <div style={{ fontSize: 11, color: C.muted }}>© 2025 Faris Store · Artisanat de Fès, Maroc</div>
      </footer>
    </div>
  )
}
