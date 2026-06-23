import React, { useState, useRef } from 'react'
import { PRODUCTS } from '../data/products.js'
import OrderForm from './_OrderForm.jsx'

const P = PRODUCTS[0]

const C = {
  bg:     '#fdf6ef',
  bg2:    '#f5e9d8',
  brown:  '#3D2310',
  terra:  '#8B4513',
  gold:   '#c19a6b',
  text:   '#2e1a0e',
  muted:  '#7a5c3a',
  line:   '#e0c9b0',
}

const FORM_STYLE = {
  inputBg:     '#fff',
  borderColor: C.line,
  accentColor: C.terra,
  textColor:   C.text,
  mutedColor:  C.muted,
  btnBg:       C.brown,
  btnText:     '#f5e9d8',
  cardBg:      C.bg2,
}

const STATS = [
  { n: '3', label: { fr: 'générations', ar: 'أجيال' } },
  { n: '6h', label: { fr: 'de travail / paire', ar: 'عمل / زوج' } },
  { n: '100%', label: { fr: 'cuir naturel', ar: 'جلد طبيعي' } },
  { n: '2 ans', label: { fr: 'de garantie', ar: 'ضمان' } },
]

export default function ThemeStory({ lang, onLangToggle, onProduct }) {
  const [imgIdx, setImgIdx] = useState(0)
  const formRef = useRef(null)
  const isAr = lang === 'ar'
  const dir  = isAr ? 'rtl' : 'ltr'
  const font = isAr ? 'Tajawal, sans-serif' : 'Georgia, serif'

  const T = isAr ? {
    label:    'قصة حذاء',
    headline: 'من قلب مدابغ شوارة في فاس',
    intro:    'منذ ثلاثة أجيال، تصنع عائلتنا الأحذية بنفس الطريقة: الجلد الطبيعي، الخياطة اليدوية، والنعل الممتاز.',
    quote:    '«ستة ساعات من العمل اليدوي في كل زوج — هذا ليس مجرد حذاء، هذا إرث»',
    quoteBy:  '— المعلّم الحسن، فاس',
    catalog:  'جميع المنتجات',
    cta:      `اطلب — ${P.prix} درهم`,
    saveMsg:  P.old ? `وفّر ${P.old - P.prix} درهم` : '',
    formTitle:'اطلب قطعتك الحرفية',
    materials:['🌿 جلد بقري طبيعي كامل الحبة', '🪡 خياطة يدوية بخيط دوبل', '⚫ نعل فيبرام سويسري', '🔶 تشطيب يدوي دقيق'],
    certTitle:'شهادة الأصالة',
    certBody: 'كل زوج مصنوع يدوياً في شوارة، فاس. الجلد مدبوغ بالطرق التقليدية.',
    badges:   ['🚚 توصيل 24-48ساعة', '💳 دفع عند الاستلام', '🛡️ ضمان سنتين', '↩️ إرجاع 14 يوماً'],
  } : {
    label:    'Histoire d\'un soulier',
    headline: 'Du cœur des tanneries Chouara de Fès',
    intro:    'Depuis trois générations, notre famille fabrique des chaussures de la même façon : cuir naturel, couture à la main, semelle d\'exception.',
    quote:    '«Six heures de travail artisanal dans chaque paire — ce n\'est pas juste une chaussure, c\'est un héritage»',
    quoteBy:  '— Maâlem Hassan, Fès',
    catalog:  'Voir le catalogue',
    cta:      `Commander — ${P.prix} MAD`,
    saveMsg:  P.old ? `Économisez ${P.old - P.prix} MAD` : '',
    formTitle:'Commandez votre paire artisanale',
    materials:['🌿 Cuir bovin pleine fleur naturel', '🪡 Couture à la main double fil', '⚫ Semelle Vibram suisse', '🔶 Finitions faites à la main'],
    certTitle:'Certificat d\'authenticité',
    certBody: 'Chaque paire est fabriquée artisanalement à Chouara, Fès. Le cuir est tanné selon les méthodes ancestrales.',
    badges:   ['🚚 Livraison 24-48h', '💳 Paiement livraison', '🛡️ Garantie 2 ans', '↩️ Retours 14 jours'],
  }

  return (
    <div style={{ background: C.bg, minHeight: '100vh', color: C.text, direction: dir, fontFamily: font }}>

      {/* ── HEADER ── */}
      <header style={{ background: C.bg, borderBottom: `1px solid ${C.line}`,
        padding: '14px 20px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <span style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 30, color: C.brown, lineHeight: 1 }}>
          Faris
        </span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => onProduct('rbati')}
            style={{ background: 'none', border: `1px solid ${C.line}`, borderRadius: 8,
              padding: '6px 12px', fontSize: 12, color: C.muted, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif' }}>
            {T.catalog}
          </button>
          <button onClick={onLangToggle}
            style={{ background: C.brown, border: 'none', borderRadius: 8,
              padding: '6px 12px', fontSize: 12, color: C.bg, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>
            {isAr ? 'FR' : 'عربي'}
          </button>
        </div>
      </header>

      {/* ── HERO IMAGE ── */}
      <section style={{ position: 'relative', height: 300, overflow: 'hidden' }}>
        <img src={P.lifestyle[0] || P.imgs[1] || P.imgs[0]} alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} />
        <div style={{ position: 'absolute', inset: 0,
          background: `linear-gradient(to bottom, transparent 40%, ${C.bg} 100%)` }} />
      </section>

      {/* ── STORY ── */}
      <section style={{ maxWidth: 780, margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ fontSize: 11, letterSpacing: 5, color: C.terra, textTransform: 'uppercase',
          marginBottom: 10, fontFamily: 'Inter, sans-serif' }}>
          {T.label}
        </div>
        <h1 style={{ fontSize: 'clamp(22px,5vw,36px)', fontWeight: 700, color: C.brown,
          lineHeight: 1.2, marginBottom: 14, margin: '0 0 14px' }}>
          {T.headline}
        </h1>
        <p style={{ fontSize: 15, color: C.muted, lineHeight: 1.8, marginBottom: 24 }}>
          {T.intro}
        </p>

        {/* Stats bar */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 28 }}>
          {STATS.map(({ n, label }) => (
            <div key={n} style={{ textAlign: 'center', padding: '14px 8px',
              background: C.bg2, border: `1px solid ${C.line}`, borderRadius: 12 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: C.terra }}>{n}</div>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 2, lineHeight: 1.3 }}>
                {label[lang]}
              </div>
            </div>
          ))}
        </div>

        {/* Pull quote */}
        <blockquote style={{ margin: '0 0 28px', padding: '18px 20px',
          borderInlineStart: `4px solid ${C.gold}`,
          background: C.bg2, borderRadius: '0 12px 12px 0' }}>
          <p style={{ fontSize: 15, fontStyle: 'italic', color: C.brown,
            lineHeight: 1.7, margin: '0 0 8px' }}>
            {T.quote}
          </p>
          <cite style={{ fontSize: 12, color: C.muted, fontStyle: 'normal' }}>{T.quoteBy}</cite>
        </blockquote>

        {/* Product image gallery */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 10 }}>
            <img src={P.imgs[imgIdx]} alt={P.nom.fr}
              style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover', display: 'block' }} />
          </div>
          {P.imgs.length > 1 && (
            <div style={{ display: 'flex', gap: 8 }}>
              {P.imgs.map((img, i) => (
                <button key={i} onClick={() => setImgIdx(i)}
                  style={{ flex: 1, border: `2px solid ${i === imgIdx ? C.terra : 'transparent'}`,
                    borderRadius: 8, overflow: 'hidden', padding: 0,
                    cursor: 'pointer', background: 'none' }}>
                  <img src={img} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, letterSpacing: 3, color: C.terra,
            textTransform: 'uppercase', marginBottom: 6, fontFamily: 'Inter, sans-serif' }}>
            {P.cat[lang]}
          </div>
          <div style={{ fontSize: 28, fontWeight: 700, color: C.brown, marginBottom: 8 }}>{P.nom[lang]}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <span style={{ fontSize: 24, fontWeight: 900, color: C.terra }}>{P.prix} MAD</span>
            {P.old && <span style={{ textDecoration: 'line-through', color: C.muted, fontSize: 16 }}>{P.old} MAD</span>}
            {P.old && <span style={{ background: C.terra, color: 'white', borderRadius: 6,
              padding: '2px 8px', fontSize: 12, fontWeight: 700 }}>{T.saveMsg}</span>}
          </div>
          <p style={{ fontSize: 14, color: C.muted, lineHeight: 1.7 }}>{P.story[lang]}</p>
        </div>

        {/* Materials */}
        <div style={{ background: C.bg2, border: `1px solid ${C.line}`,
          borderRadius: 14, padding: '18px 16px', marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.brown, marginBottom: 12,
            fontFamily: 'Inter, sans-serif' }}>
            {isAr ? 'المواد والتشطيب' : 'Matériaux & finitions'}
          </div>
          {T.materials.map(m => (
            <div key={m} style={{ fontSize: 13, color: C.muted, padding: '6px 0',
              borderBottom: `1px solid ${C.line}` }}>
              {m}
            </div>
          ))}
        </div>

        {/* Order form */}
        <div ref={formRef} style={{ background: C.bg2, border: `1px solid ${C.line}`,
          borderRadius: 16, padding: '22px 18px', marginBottom: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: C.brown, marginBottom: 18,
            fontFamily: 'Inter, sans-serif' }}>
            {T.formTitle}
          </div>
          <OrderForm product={P} lang={lang} S={FORM_STYLE} />
        </div>

        {/* Certificate */}
        <div style={{ border: `2px solid ${C.gold}`, borderRadius: 14, padding: '18px 16px',
          marginBottom: 24, position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -10, insetInlineEnd: -10, fontSize: 80,
            opacity: 0.05, color: C.brown }}>🏛️</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.terra, marginBottom: 8,
            fontFamily: 'Inter, sans-serif' }}>
            🏅 {T.certTitle}
          </div>
          <div style={{ fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{T.certBody}</div>
        </div>

        {/* Trust badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
          {T.badges.map(b => (
            <span key={b} style={{ fontSize: 12, color: C.muted, padding: '6px 14px',
              border: `1px solid ${C.line}`, borderRadius: 50, background: C.bg2 }}>
              {b}
            </span>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.brown, padding: '28px 20px', textAlign: 'center', marginTop: 20 }}>
        <div style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 30, color: C.gold, marginBottom: 4 }}>Faris</div>
        <div style={{ fontSize: 11, color: C.gold + '80' }}>© 2025 · Artisanat de Fès, Maroc</div>
      </footer>
    </div>
  )
}
