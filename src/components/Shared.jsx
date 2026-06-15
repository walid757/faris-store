import React, { useEffect, useState } from 'react'
import { t } from '../data/translations.js'

const C = { T: '#1d6475', GD: '#b8935a', DK: '#1a1a1a', CR: '#f5f3ef' }

// ── MARQUEE ────────────────────────────────────────────────────
export function Marquee({ lang = 'fr' }) {
  const tr = t(lang)
  const text = tr.marquee.join('   ·   ')

  useEffect(() => {
    const s = document.createElement('style')
    s.id = 'faris-marquee-css'
    s.textContent = '@keyframes faris-scroll{from{transform:translateX(0)}to{transform:translateX(-50%)}}'
    if (!document.getElementById('faris-marquee-css')) document.head.appendChild(s)
  }, [])

  return (
    <div style={{ background: '#1a1a1a', overflow: 'hidden', whiteSpace: 'nowrap',
      padding: '9px 0', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
      <div style={{ display: 'inline-block', animation: 'faris-scroll 32s linear infinite' }}>
        <span style={{ fontFamily: lang === 'ar' ? 'Tajawal,sans-serif' : 'Inter,sans-serif',
          fontSize: 12, color: 'rgba(255,255,255,.85)', letterSpacing: .3 }}>
          {text}&nbsp;&nbsp;·&nbsp;&nbsp;{text}
        </span>
      </div>
    </div>
  )
}

// ── HEADER ─────────────────────────────────────────────────────
export function Header({ lang = 'fr', onHome, logoClicks, onLogoClick, onLangToggle }) {
  const tr = t(lang)

  return (
    <div style={{ background: 'white', borderBottom: '1px solid #f0ebe3',
      padding: '11px 16px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100,
      boxShadow: '0 1px 8px rgba(0,0,0,.06)', direction: tr.dir }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
        <button onClick={onHome} style={{ background: 'none', border: 'none', cursor: 'pointer',
          fontSize: 13, fontFamily: 'Inter,sans-serif', color: '#555' }}>
          ←
        </button>
        <button onClick={onLangToggle} style={{ background: lang === 'ar' ? C.T : '#f0ede8',
          border: 'none', cursor: 'pointer', padding: '4px 10px', fontSize: 11,
          fontFamily: 'Inter,sans-serif', fontWeight: 700, color: lang === 'ar' ? 'white' : C.DK,
          borderRadius: 2 }}>
          {lang === 'fr' ? 'عربي' : 'FR'}
        </button>
      </div>
      <div onClick={onLogoClick} style={{ cursor: 'pointer', textAlign: 'center', userSelect: 'none' }}>
        <div style={{ fontFamily: "'Pinyon Script',cursive", fontSize: 30, color: C.DK, lineHeight: 1 }}>
          Faris
        </div>
        <div style={{ fontSize: 7, letterSpacing: 3, color: '#aaa',
          fontFamily: 'Inter,sans-serif', fontWeight: 600, marginTop: 1 }}>
          {tr.cuirMarocain}
        </div>
      </div>
      <div style={{ width: 60 }} />
    </div>
  )
}

// ── STARS ──────────────────────────────────────────────────────
export function Stars({ n }) {
  return (
    <span style={{ color: '#e8a020', fontSize: 14, letterSpacing: 1 }}>
      {'★'.repeat(n)}{'☆'.repeat(5 - n)}
    </span>
  )
}

// ── TOAST ──────────────────────────────────────────────────────
export function Toast({ msg }) {
  if (!msg) return null
  return (
    <div style={{ position: 'fixed', bottom: 22, left: '50%', transform: 'translateX(-50%)',
      zIndex: 9999, background: C.DK, color: 'white', padding: '10px 20px', fontSize: 13,
      fontFamily: 'Inter,sans-serif', whiteSpace: 'nowrap',
      boxShadow: '0 4px 20px rgba(0,0,0,.3)' }}>
      {msg}
    </div>
  )
}

// ── WHATSAPP BUTTON ────────────────────────────────────────────
export function WhatsApp({ lang = 'fr' }) {
  const [number, setNumber] = useState('')

  useEffect(() => {
    fetch('/api/config').then(r => r.json()).then(d => setNumber(d.whatsapp)).catch(() => {})
  }, [])

  const msg = lang === 'ar'
    ? 'مرحباً، أريد الاستفسار عن منتجات فارس'
    : 'Bonjour, je voudrais me renseigner sur les produits Faris'

  return (
    <a href={number ? `https://wa.me/${number}?text=${encodeURIComponent(msg)}` : '#'}
      target="_blank" rel="noopener noreferrer"
      style={{ position: 'fixed', bottom: 20, right: 14, width: 54, height: 54,
        background: '#25d366', borderRadius: '50%', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 26, cursor: 'pointer', zIndex: 150,
        boxShadow: '0 4px 18px rgba(37,211,102,.45)', textDecoration: 'none' }}>
      💬
    </a>
  )
}

// ── ORDER FORM ────────────────────────────────────────────────
export function OrderForm({ lang, form, setForm, errs, onSubmit, prix, currency }) {
  const tr = t(lang)
  const AF = { fontFamily: tr.font }

  const inp = (err) => ({
    width: '100%', padding: '10px 13px',
    border: `1px solid ${err ? '#e05050' : '#e0dbd4'}`,
    ...AF, fontSize: 13, outline: 'none', background: 'white',
    color: C.DK, borderRadius: 2, boxSizing: 'border-box', direction: tr.dir
  })

  const fields = [
    ['nom',     tr.fullName, 'Mohamed El Alami'],
    ['tel',     tr.phone,    '0612345678'],
    ['adresse', tr.address,  '12 Rue Hassan II'],
    ['ville',   tr.city,     'Casablanca']
  ]

  return (
    <div style={{ background: '#f8f6f2', padding: '16px 14px', marginBottom: 16,
      border: '1px solid #ede8e0' }}>
      <div style={{ fontSize: 11, ...AF, fontWeight: 700, marginBottom: 12, color: C.DK,
        letterSpacing: 1 }}>
        {tr.delivery}
      </div>
      {fields.map(([k, label, ph]) => (
        <div key={k} style={{ marginBottom: 10 }}>
          <label style={{ fontSize: 11, ...AF, fontWeight: 600, color: '#666',
            display: 'block', marginBottom: 4 }}>
            {label}
          </label>
          <input
            value={form[k]}
            onChange={e => setForm(f => ({
              ...f,
              [k]: k === 'tel' ? e.target.value.replace(/\D/g, '') : e.target.value
            }))}
            maxLength={k === 'tel' ? 10 : undefined}
            placeholder={ph}
            style={inp(errs[k])}
          />
          {errs[k] && (
            <div style={{ fontSize: 10, color: '#e05050', marginTop: 3, ...AF }}>
              ⚠️ {errs[k]}
            </div>
          )}
        </div>
      ))}
      {/* COD Badge */}
      <div style={{ background: '#fff8ee', border: '1px solid #f0d8a0',
        padding: '9px 12px', display: 'flex', gap: 8, alignItems: 'center', marginTop: 4 }}>
        <span style={{ fontSize: 16 }}>💵</span>
        <div style={{ ...AF, fontSize: 12 }}>
          <div style={{ fontWeight: 700, color: C.DK }}>{tr.cod}</div>
          <div style={{ color: '#888', marginTop: 1 }}>{tr.codSub}</div>
        </div>
      </div>
    </div>
  )
}

export const COLORS = C
