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
export function WhatsApp() {
  useEffect(() => {
    const s = document.createElement('style')
    s.id = 'faris-wa-css'
    s.textContent = `
      @keyframes wa-pulse {
        0%   { transform: scale(1);   opacity: .5; }
        100% { transform: scale(2.2); opacity: 0;  }
      }
      @keyframes wa-bounce {
        0%,100% { transform: translateY(0);  }
        50%      { transform: translateY(-6px); }
      }
      .wa-wrap:hover .wa-btn  { transform: scale(1.08); }
      .wa-wrap:hover .wa-label { opacity: 1 !important; transform: translateX(0) !important; }
    `
    if (!document.getElementById('faris-wa-css')) document.head.appendChild(s)
  }, [])

  const msg = 'السلام عليكم، أريد الاستفسار عن منتجات فارس للأحذية الجلدية 👟'

  return (
    <div className="wa-wrap" style={{ position: 'fixed', bottom: 24, right: 16, zIndex: 150,
      display: 'flex', alignItems: 'center', gap: 10 }}>

      {/* Label */}
      <div className="wa-label" style={{
        background: 'white', color: '#111', fontSize: 13, fontWeight: 700,
        padding: '8px 14px', borderRadius: 20, whiteSpace: 'nowrap',
        boxShadow: '0 4px 16px rgba(0,0,0,.15)',
        opacity: 0, transform: 'translateX(10px)',
        transition: 'all .3s ease', fontFamily: 'Tajawal,sans-serif',
        border: '1px solid #e8e8e8'
      }}>
        💬 تواصل معنا
      </div>

      {/* Pulse rings */}
      <div style={{ position: 'relative', width: 60, height: 60, flexShrink: 0 }}>
        {[0, 400].map(d => (
          <span key={d} style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'rgba(37,211,102,.45)',
            animation: `wa-pulse 2s ease-out ${d}ms infinite`
          }} />
        ))}
        <a href={`https://wa.me/212642499661?text=${encodeURIComponent(msg)}`}
          target="_blank" rel="noopener noreferrer" className="wa-btn"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(135deg, #25d366, #128c4e)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 24px rgba(37,211,102,.55)', textDecoration: 'none',
            transition: 'transform .2s ease',
            animation: 'wa-bounce 3s ease-in-out infinite'
          }}>
          <svg viewBox="0 0 32 32" width="32" height="32" fill="white">
            <path d="M16 2C8.27 2 2 8.27 2 16c0 2.44.65 4.73 1.79 6.72L2 30l7.5-1.96A13.93 13.93 0 0016 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm0 25.5c-2.22 0-4.3-.6-6.1-1.64l-.44-.26-4.45 1.16 1.19-4.33-.29-.46A11.47 11.47 0 014.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.3-8.56c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17s-.9 1.11-1.1 1.34c-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.67-.57-.58-.78-.59h-.67c-.23 0-.6.09-.91.43-.32.34-1.21 1.18-1.21 2.88s1.24 3.34 1.41 3.57c.17.23 2.44 3.73 5.91 5.23.83.36 1.47.57 1.97.73.83.26 1.58.23 2.17.14.66-.1 2.02-.83 2.31-1.62.28-.8.28-1.48.2-1.62-.09-.14-.32-.23-.66-.4z"/>
          </svg>
        </a>
      </div>
    </div>
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
