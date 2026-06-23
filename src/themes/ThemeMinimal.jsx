import React, { useState, useRef } from 'react'
import { PRODUCTS } from '../data/products.js'
import OrderForm from './_OrderForm.jsx'

const P = PRODUCTS[0]

const C = {
  bg:     '#ffffff',
  bg2:    '#f8f8f8',
  dark:   '#111111',
  accent: '#a0714f',
  muted:  '#888888',
  line:   '#e8e8e8',
}

const FORM_STYLE = {
  inputBg:     '#f8f8f8',
  borderColor: '#e8e8e8',
  accentColor: C.accent,
  textColor:   C.dark,
  mutedColor:  C.muted,
  btnBg:       C.dark,
  btnText:     '#ffffff',
  cardBg:      '#ffffff',
}

export default function ThemeMinimal({ lang, onLangToggle, onProduct }) {
  const [imgIdx, setImgIdx] = useState(0)
  const formRef = useRef(null)
  const isAr = lang === 'ar'
  const dir  = isAr ? 'rtl' : 'ltr'
  const fontUI = 'Inter, sans-serif'
  const fontAr = 'Tajawal, sans-serif'
  const font = isAr ? fontAr : fontUI

  const T = isAr ? {
    cat:      P.cat.ar,
    name:     P.nom.ar,
    sub:      P.sub.ar,
    story:    P.story.ar,
    catalog:  'جميع المنتجات',
    cta:      `اطلب الآن — ${P.prix} درهم`,
    formTitle:'تفاصيل الطلب',
    features: [
      ['جلد طبيعي', 'كامل الحبة من المغرب'],
      ['صنع في فاس', 'حرفة عائلية أصيلة'],
      ['نعل فيبرام', 'جودة سويسرية'],
      ['ضمان سنتين', 'إصلاح مجاني'],
    ],
    delivery: 'توصيل 24-48ساعة',
    cod:      'دفع عند الاستلام',
  } : {
    cat:      P.cat.fr,
    name:     P.nom.fr,
    sub:      P.sub.fr,
    story:    P.story.fr,
    catalog:  'Tous les produits',
    cta:      `Commander — ${P.prix} MAD`,
    formTitle:'Vos informations',
    features: [
      ['Cuir naturel', 'Pleine fleur du Maroc'],
      ['Fait à Fès', 'Artisanat familial'],
      ['Semelle Vibram', 'Qualité suisse'],
      ['Garantie 2 ans', 'Réparation offerte'],
    ],
    delivery: 'Livraison 24-48h',
    cod:      'Paiement livraison',
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.dark, direction: dir, fontFamily: font }}>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: `1px solid ${C.line}`, padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 30, color: C.dark, lineHeight: 1 }}>
          Faris
        </span>
        <nav style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button onClick={() => onProduct('rbati')}
            style={{ background: 'none', border: 'none', fontSize: 13, color: C.muted,
              cursor: 'pointer', fontFamily: font, padding: 0 }}>
            {T.catalog}
          </button>
          <button onClick={onLangToggle}
            style={{ background: 'none', border: `1px solid ${C.line}`, borderRadius: 6,
              padding: '5px 12px', fontSize: 12, color: C.dark, cursor: 'pointer', fontFamily: font }}>
            {isAr ? 'FR' : 'عربي'}
          </button>
        </nav>
      </header>

      {/* ── PRODUCT ── */}
      <main style={{ maxWidth: 780, margin: '0 auto', padding: '40px 24px' }}>

        {/* Hero image */}
        <div style={{ marginBottom: 32, position: 'relative' }}>
          <img src={P.imgs[imgIdx]} alt={P.nom.fr}
            style={{ width: '100%', borderRadius: 4, display: 'block',
              aspectRatio: '16/9', objectFit: 'cover' }} />
          {P.imgs.length > 1 && (
            <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
              {P.imgs.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  style={{ flex: 1, border: `1px solid ${i === imgIdx ? C.dark : C.line}`,
                    borderRadius: 4, overflow: 'hidden', padding: 0,
                    cursor: 'pointer', background: 'none' }}>
                  <img src={img} alt="" style={{ width: '100%', aspectRatio: '1',
                    objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: C.muted,
            textTransform: 'uppercase', marginBottom: 8, fontFamily: fontUI }}>
            {T.cat}
          </div>
          <h1 style={{ fontSize: 'clamp(28px,6vw,48px)', fontWeight: 900, color: C.dark,
            fontFamily: 'Georgia, serif', margin: '0 0 8px', lineHeight: 1 }}>
            {T.name}
          </h1>
          <p style={{ fontSize: 13, color: C.muted, margin: '0 0 16px', letterSpacing: 0.5 }}>
            {T.sub}
          </p>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginBottom: 16 }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: C.dark }}>{P.prix} MAD</span>
            {P.old && (
              <span style={{ textDecoration: 'line-through', color: C.muted, fontSize: 18 }}>{P.old} MAD</span>
            )}
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7, maxWidth: 540, margin: 0 }}>
            {T.story}
          </p>
        </div>

        {/* Features grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 1,
          border: `1px solid ${C.line}`, borderRadius: 8, overflow: 'hidden', marginBottom: 40 }}>
          {T.features.map(([title, desc]) => (
            <div key={title} style={{ padding: '18px 16px', background: C.bg2,
              borderBottom: `1px solid ${C.line}`, borderInlineEnd: `1px solid ${C.line}` }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.dark,
                marginBottom: 3, fontFamily: fontUI }}>
                {title}
              </div>
              <div style={{ fontSize: 12, color: C.muted }}>{desc}</div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${C.line}`, marginBottom: 32 }} />

        {/* CTA + Form */}
        <div>
          <button onClick={() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
            style={{ width: '100%', padding: '18px', background: C.dark, color: 'white',
              fontSize: 15, fontWeight: 700, border: 'none', borderRadius: 4, cursor: 'pointer',
              fontFamily: font, marginBottom: 10, letterSpacing: 1, textTransform: 'uppercase' }}>
            {T.cta}
          </button>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
            <span style={{ fontSize: 12, color: C.muted }}>🚚 {T.delivery}</span>
            <span style={{ fontSize: 12, color: C.muted }}>💳 {T.cod}</span>
          </div>

          {/* Form */}
          <div ref={formRef} style={{ borderTop: `1px solid ${C.line}`, paddingTop: 32 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.dark, marginBottom: 20,
              letterSpacing: 2, textTransform: 'uppercase', fontFamily: fontUI }}>
              {T.formTitle}
            </div>
            <OrderForm product={P} lang={lang} S={FORM_STYLE} />
          </div>
        </div>

        {/* Lifestyle image */}
        {P.lifestyle.length > 0 && (
          <div style={{ marginTop: 48, marginBottom: 32 }}>
            <img src={P.lifestyle[0]} alt=""
              style={{ width: '100%', borderRadius: 4, display: 'block',
                aspectRatio: '16/9', objectFit: 'cover' }} />
          </div>
        )}
      </main>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: `1px solid ${C.line}`, padding: '24px', textAlign: 'center' }}>
        <div style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 24, color: C.dark, marginBottom: 4 }}>Faris</div>
        <div style={{ fontSize: 11, color: C.muted }}>© 2025 Faris Store · Artisanat de Fès, Maroc</div>
      </footer>
    </div>
  )
}
