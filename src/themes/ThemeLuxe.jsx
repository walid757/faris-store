import React, { useState, useRef } from 'react'
import { PRODUCTS } from '../data/products.js'
import OrderForm from './_OrderForm.jsx'

const P = PRODUCTS[0] // Rbati — featured product

const C = {
  bg:    '#130a04',
  bg2:   '#1e1008',
  bg3:   '#2C1A0E',
  gold:  '#C9A077',
  goldB: '#a87040',
  text:  '#f0e6d8',
  muted: '#8b7355',
  line:  '#3D2310',
}

const FORM_STYLE = {
  inputBg:     C.bg,
  borderColor: C.line,
  accentColor: C.gold,
  textColor:   C.text,
  mutedColor:  C.muted,
  btnBg:       `linear-gradient(135deg, ${C.gold}, ${C.goldB})`,
  btnText:     C.bg,
  cardBg:      C.bg2,
}

export default function ThemeLuxe({ lang, onLangToggle, onProduct }) {
  const [imgIdx, setImgIdx] = useState(0)
  const formRef = useRef(null)
  const isAr = lang === 'ar'
  const dir  = isAr ? 'rtl' : 'ltr'
  const font = isAr ? 'Tajawal, sans-serif' : 'Inter, sans-serif'

  const T = isAr ? {
    tagline:  'حرفية فاسية أصيلة',
    sub:      'جلد طبيعي كامل الحبة · نعل فيبرام · صنع يدوياً في فاس',
    cta:      `اطلب الآن — ${P.prix} درهم`,
    discount: `كان ${P.old} درهم`,
    catalog:  'جميع المنتجات',
    features: [
      ['🌿', 'جلد طبيعي', 'جلد بقري كامل الحبة، يجمّل مع الزمن'],
      ['⚡', 'نعل فيبرام', 'مطاطة عالية الجودة، مريحة وتدوم طويلاً'],
      ['🏛️', 'صنع في فاس', '6 ساعات عمل يدوي لكل زوج'],
      ['🛡️', 'ضمان سنتين', 'إصلاح مجاني لمدة عامين كاملين'],
    ],
    badges: ['🚚 توصيل 24-48ساعة', '💳 دفع عند الاستلام', '🛡️ ضمان سنتين', '✋ 100% يدوي'],
    formTitle: 'اطلب الآن',
  } : {
    tagline:  "Artisanat fassi d'exception",
    sub:      'Cuir pleine fleur naturel · Semelle Vibram · Fait à la main à Fès',
    cta:      `Commander — ${P.prix} MAD`,
    discount: `était ${P.old} MAD`,
    catalog:  'Tous les produits',
    features: [
      ['🌿', 'Cuir naturel', 'Cuir bovin pleine fleur, embellit avec le temps'],
      ['⚡', 'Semelle Vibram', 'Caoutchouc haute qualité, résistant et confortable'],
      ['🏛️', 'Fait à Fès', '6 heures de travail artisanal par paire'],
      ['🛡️', 'Garantie 2 ans', 'Réparation gratuite pendant 2 ans'],
    ],
    badges: ['🚚 Livraison 24-48h', '💳 Paiement livraison', '🛡️ Garantie 2 ans', '✋ 100% artisanal'],
    formTitle: 'Passer la commande',
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, direction: dir, fontFamily: font }}>

      {/* ── HEADER ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(19,10,4,0.94)', backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${C.line}`, padding: '13px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 28, color: C.gold, lineHeight: 1 }}>
          Faris
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onProduct('rbati')}
            style={{ background: 'none', border: `1px solid ${C.line}`, borderRadius: 8,
              padding: '6px 12px', fontSize: 12, color: C.muted, cursor: 'pointer', fontFamily: font }}>
            {T.catalog}
          </button>
          <button onClick={onLangToggle}
            style={{ background: C.gold, border: 'none', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, color: C.bg, cursor: 'pointer',
              fontFamily: font, fontWeight: 700 }}>
            {isAr ? 'FR' : 'عربي'}
          </button>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <img src={P.imgs[0]} alt={P.nom.fr}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', filter: 'brightness(0.3)', transition: 'opacity .5s' }} />
        <div style={{
          position: 'absolute', inset: 0,
          background: `linear-gradient(to top, ${C.bg} 0%, transparent 50%)`
        }} />
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '0 24px', maxWidth: 520 }}>
          <div style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 'clamp(72px,16vw,110px)',
            color: C.gold, lineHeight: 0.9, marginBottom: 10 }}>
            Faris
          </div>
          <div style={{ fontSize: 11, letterSpacing: 6, color: C.muted, textTransform: 'uppercase', marginBottom: 20 }}>
            {T.tagline}
          </div>
          <div style={{ fontSize: 'clamp(26px,6vw,44px)', fontWeight: 900, color: 'white',
            fontFamily: 'Georgia, serif', lineHeight: 1.1, marginBottom: 8 }}>
            {P.nom[lang]}
          </div>
          <div style={{ fontSize: 13, color: C.muted, marginBottom: 28, maxWidth: 340, margin: '0 auto 28px' }}>
            {T.sub}
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              style={{ padding: '15px 36px', background: C.gold, color: C.bg,
                fontSize: 15, fontWeight: 900, border: 'none', borderRadius: 50,
                cursor: 'pointer', fontFamily: font, letterSpacing: 1 }}>
              {T.cta}
            </button>
            {P.old && (
              <span style={{ textDecoration: 'line-through', color: C.muted, fontSize: 15 }}>
                {T.discount}
              </span>
            )}
          </div>
        </div>
        <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)',
          color: C.muted, fontSize: 10, letterSpacing: 4, textTransform: 'uppercase' }}>
          ↓ scroll
        </div>
      </section>

      {/* ── PRODUCT + FORM ── */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '60px 18px 20px' }}>
        {/* Image Gallery */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 10, aspectRatio: '16/9' }}>
            <img src={P.imgs[imgIdx]} alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {P.imgs.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                style={{ flex: 1, border: `2px solid ${i === imgIdx ? C.gold : 'transparent'}`,
                  borderRadius: 10, overflow: 'hidden', padding: 0, cursor: 'pointer',
                  background: 'none', aspectRatio: '1' }}>
                <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: C.muted,
            textTransform: 'uppercase', marginBottom: 6 }}>
            {P.cat[lang]}
          </div>
          <div style={{ fontSize: 'clamp(28px,6vw,40px)', fontFamily: 'Georgia, serif',
            fontWeight: 700, marginBottom: 8, lineHeight: 1.1 }}>
            {P.nom[lang]}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: C.gold }}>{P.prix} MAD</span>
            {P.old && (
              <span style={{ textDecoration: 'line-through', color: C.muted, fontSize: 17 }}>{P.old} MAD</span>
            )}
          </div>
          <div style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, borderLeft: `2px solid ${C.gold}`,
            paddingLeft: 14, marginBottom: 0 }}>
            {P.story[lang]}
          </div>
        </div>

        {/* Order Form */}
        <div ref={formRef} style={{ background: C.bg2, border: `1px solid ${C.line}`,
          borderRadius: 16, padding: '24px 18px' }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 18, letterSpacing: 1 }}>
            {T.formTitle.toUpperCase()}
          </div>
          <OrderForm product={P} lang={lang} S={FORM_STYLE} />
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: C.bg2, padding: '48px 18px', marginTop: 40 }}>
        <div style={{ maxWidth: 780, margin: '0 auto',
          display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 14 }}>
          {T.features.map(([icon, title, desc]) => (
            <div key={title} style={{ background: C.bg, border: `1px solid ${C.line}`,
              borderRadius: 14, padding: '18px 16px' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: C.gold, marginBottom: 4 }}>{title}</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.5 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section style={{ padding: '32px 18px' }}>
        <div style={{ maxWidth: 780, margin: '0 auto',
          display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
          {T.badges.map(b => (
            <span key={b} style={{ fontSize: 13, color: C.muted, padding: '6px 14px',
              border: `1px solid ${C.line}`, borderRadius: 50 }}>
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.line}`, padding: '24px 18px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 28, color: C.gold, marginBottom: 4 }}>
          Faris
        </div>
        <div style={{ fontSize: 11, color: C.muted }}>© 2025 Faris Store · Artisanat de Fès, Maroc</div>
      </footer>
    </div>
  )
}
