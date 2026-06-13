import React, { useState, useEffect, useRef } from 'react'
import { Marquee, Header, Stars, WhatsApp, Toast, OrderForm, COLORS as C } from '../components/Shared.jsx'
import { getProduct, COULEURS } from '../data/products.js'
import { t } from '../data/translations.js'
import { createOrder, fbPixel } from '../api/client.js'

export default function ProductPage({ slug = 'rbati', lang = 'fr', onLangToggle, onBack }) {
  const prod = getProduct(slug)
  const tr   = t(lang)
  const AF   = { fontFamily: tr.font, direction: tr.dir }

  const [slide,   setSlide]   = useState(0)
  const [color,   setColor]   = useState(0)
  const [size,    setSize]    = useState(null)
  const [acc,     setAcc]     = useState('')
  const [form,    setForm]    = useState({ nom:'', tel:'', adresse:'', ville:'' })
  const [errs,    setErrs]    = useState({})
  const [ordered, setOrdered] = useState(false)
  const [loading, setLoading] = useState(false)
  const [toast,   setToast]   = useState('')
  const [logoN,   setLogoN]   = useState(0)
  const logoTimer              = useRef(null)

  // All images: slider + lifestyle
  const allImgs = [...prod.imgs, ...prod.lifestyle]

  useEffect(() => {
    const id = setInterval(() => setSlide(s => (s + 1) % allImgs.length), 4500)
    // Track ViewContent
    fbPixel('ViewContent', { content_name: prod.nom.fr, value: prod.prix, currency: 'MAD' })
    return () => clearInterval(id)
  }, [])

  const toast$ = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2600) }

  const handleLogo = () => {
    const n = logoN + 1
    setLogoN(n)
    clearTimeout(logoTimer.current)
    logoTimer.current = setTimeout(() => setLogoN(0), 2000)
    if (n >= 5) { setLogoN(0); window.location.hash = '#admin' }
  }

  const validate = () => {
    const e = {}
    if (!form.nom.trim())  e.nom     = tr.errNom
    if (!form.tel || !/^0[67]\d{8}$/.test(form.tel)) e.tel = tr.errTel
    if (!form.adresse.trim()) e.adresse = tr.errAdresse
    if (!form.ville.trim())   e.ville   = tr.errVille
    if (prod.tailles.length > 0 && !size) e.size = tr.errTaille
    return e
  }

  const commander = async () => {
    const e = validate()
    if (Object.keys(e).length > 0) return setErrs(e)
    setErrs({})
    setLoading(true)

    try {
      const res = await createOrder({
        nom:     form.nom,
        tel:     form.tel,
        adresse: form.adresse,
        ville:   form.ville,
        produit: prod.nom.fr,
        couleur: prod.couleurs[color],
        taille:  size,
        prix:    prod.prix,
        langue:  lang
      })

      if (res.success) {
        fbPixel('Purchase', { value: prod.prix, currency: 'MAD', content_name: prod.nom.fr })
        setOrdered(true)
        window.scrollTo(0, 0)
      } else if (res.blocked) {
        toast$(tr.errBlocked)
      } else if (res.field) {
        setErrs({ [res.field]: res.error })
      } else {
        toast$(res.error || 'Erreur, réessayez')
      }
    } catch {
      toast$('Erreur réseau, réessayez')
    } finally {
      setLoading(false)
    }
  }

  // ── CONFIRMATION ─────────────────────────────────────────────
  if (ordered) return (
    <div style={{ ...AF, background: 'white', maxWidth: 780, margin: '0 auto' }}>
      <Marquee lang={lang} />
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#f5f3ef', padding: 20 }}>
        <div style={{ background: 'white', padding: '36px 24px', textAlign: 'center',
          maxWidth: 380, width: '100%', boxShadow: '0 8px 40px rgba(0,0,0,.08)' }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
          <div style={{ fontFamily: "'Pinyon Script',cursive", fontSize: 34, color: C.T, marginBottom: 7 }}>Faris</div>
          <h2 style={{ ...AF, fontWeight: 900, fontSize: 22, marginBottom: 10 }}>{tr.confirmed}</h2>
          <p style={{ ...AF, fontSize: 13, color: '#666', lineHeight: 1.8, marginBottom: 14 }}>
            {tr.confirmedSub}
          </p>
          <div style={{ background: '#f8f6f2', padding: '12px', marginBottom: 16,
            textAlign: lang === 'ar' ? 'right' : 'left', borderLeft: `3px solid ${C.T}` }}>
            {[
              [prod.nom[lang] || prod.nom.fr, lang === 'fr' ? 'Produit' : 'المنتج'],
              [prod.couleurs[color], lang === 'fr' ? 'Couleur' : 'اللون'],
              ...(size ? [[`EU ${size}`, lang === 'fr' ? 'Pointure' : 'المقاس']] : []),
              [form.tel,   lang === 'fr' ? 'Tél' : 'الهاتف'],
              [form.ville, lang === 'fr' ? 'Ville' : 'المدينة'],
              [`${prod.prix} ${tr.currency}`, lang === 'fr' ? 'Total' : 'الإجمالي'],
            ].map(([v, k]) => (
              <div key={k} style={{ display: 'flex', justifyContent: 'space-between',
                padding: '5px 0', borderBottom: '1px solid #ede8e0',
                fontFamily: 'Inter,sans-serif', fontSize: 12 }}>
                <span style={{ color: '#aaa' }}>{k}</span>
                <span style={{ fontWeight: 600, color: C.DK }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ background: '#e8f5e9', padding: '10px 12px', ...AF,
            fontSize: 12, color: '#2e7d32', marginBottom: 16, borderRadius: 2 }}>
            {lang === 'fr' ? '📞 Notre équipe vous contacte dans les 24h.' : '📞 سيتصل بك فريقنا خلال 24 ساعة.'}
          </div>
          <button onClick={() => { setOrdered(false); setForm({ nom:'', tel:'', adresse:'', ville:'' }); setSize(null); onBack() }}
            style={{ padding: '12px 22px', background: C.DK, color: 'white', fontSize: 12,
              ...AF, fontWeight: 700, border: 'none', cursor: 'pointer', letterSpacing: 1 }}>
            {tr.backToShop}
          </button>
        </div>
      </div>
    </div>
  )

  // ── PRODUCT PAGE ──────────────────────────────────────────────
  return (
    <div style={{ ...AF, background: 'white', color: C.DK, maxWidth: 780, margin: '0 auto', overflowX: 'hidden' }}>
      <Toast msg={toast} />
      <Marquee lang={lang} />
      <Header lang={lang} onHome={onBack} onLogoClick={handleLogo} onLangToggle={onLangToggle} />

      {/* BREADCRUMB */}
      <div style={{ maxWidth: 780, margin: '0 auto', padding: '10px 14px',
        fontSize: 12, fontFamily: 'Inter,sans-serif', color: '#aaa',
        display: 'flex', gap: 7, direction: 'ltr' }}>
        <span style={{ cursor: 'pointer' }} onClick={onBack}>
          {lang === 'fr' ? 'Accueil' : 'الرئيسية'}
        </span>
        <span>›</span>
        <span style={{ cursor: 'pointer' }} onClick={onBack}>{prod.cat[lang] || prod.cat.fr}</span>
        <span>›</span>
        <span style={{ color: C.DK }}>{prod.nom[lang] || prod.nom.fr}</span>
      </div>

      {/* SLIDER */}
      <div style={{ background: '#0a0a0a', overflow: 'hidden' }}>
        <div style={{ position: 'relative', aspectRatio: '4/3', overflow: 'hidden' }}>
          {allImgs.map((src, i) => (
            <div key={i} style={{ position: 'absolute', inset: 0, opacity: i === slide ? 1 : 0,
              transition: 'opacity .65s ease', pointerEvents: i === slide ? 'auto' : 'none' }}>
              <img src={src} alt={prod.nom.fr}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
            </div>
          ))}
          <div style={{ position: 'absolute', top: 12, right: 14, fontSize: 11,
            color: 'rgba(255,255,255,.6)', fontFamily: 'Inter,sans-serif' }}>
            {slide + 1} / {allImgs.length}
          </div>
          <div style={{ position: 'absolute', bottom: 12, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 5 }}>
            {allImgs.map((_, i) => (
              <div key={i} onClick={() => setSlide(i)}
                style={{ width: i === slide ? 18 : 5, height: 5,
                  background: i === slide ? 'white' : 'rgba(255,255,255,.45)',
                  borderRadius: 3, cursor: 'pointer', transition: 'all .3s' }} />
            ))}
          </div>
        </div>
        {/* Caption */}
        <div style={{ padding: '12px 16px 14px', borderTop: '1px solid rgba(255,255,255,.08)' }}>
          <div style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: 17, color: 'white' }}>
            {prod.nom[lang] || prod.nom.fr} – {prod.cat[lang] || prod.cat.fr}
          </div>
        </div>
      </div>

      {/* THUMBS */}
      {allImgs.length > 1 && (
        <div style={{ display: 'flex', gap: 3, padding: '3px', background: '#f8f6f2',
          overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          {allImgs.map((src, i) => (
            <div key={i} onClick={() => setSlide(i)}
              style={{ flexShrink: 0, width: 68, height: 50, overflow: 'hidden', cursor: 'pointer',
                border: `2px solid ${i === slide ? C.T : 'transparent'}`, transition: 'border .15s' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover',
                display: 'block', filter: i === slide ? 'none' : 'brightness(.85)' }} />
            </div>
          ))}
        </div>
      )}

      {/* PRODUCT INFO */}
      <div style={{ padding: '16px 14px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: '#aaa', fontFamily: 'Inter,sans-serif',
            fontWeight: 700 }}>{prod.cat[lang] || prod.cat.fr}</div>
          <div style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700, fontSize: 16 }}>
            {prod.old && <span style={{ fontSize: 12, color: '#bbb', textDecoration: 'line-through',
              marginRight: 6 }}>{prod.old}</span>}
            <span style={{ color: C.T }}>{prod.prix} {tr.currency}</span>
          </div>
        </div>
        <h1 style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', fontWeight: 600,
          fontSize: 32, color: C.DK, lineHeight: 1, marginBottom: 5 }}>
          {prod.nom[lang] || prod.nom.fr}
        </h1>
        <div style={{ fontSize: 12, color: '#888', ...AF, marginBottom: 8 }}>
          {prod.sub[lang] || prod.sub.fr}
        </div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center', marginBottom: 16 }}>
          <Stars n={5} />
          <span style={{ fontSize: 11, fontFamily: 'Inter,sans-serif', color: '#aaa', marginLeft: 5 }}>
            147 {tr.ratingLabel}
          </span>
        </div>

        {/* Story */}
        <div style={{ background: '#f8f6f2', borderLeft: `3px solid ${C.GD}`,
          padding: '12px 14px', marginBottom: 18, fontFamily: 'Georgia,serif',
          fontStyle: 'italic', fontSize: 14, color: '#555', lineHeight: 1.8 }}>
          {prod.story[lang] || prod.story.fr}
        </div>

        {/* COLORS */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, ...AF, fontWeight: 700, letterSpacing: 1, marginBottom: 9 }}>
            {tr.color}: <span style={{ fontWeight: 400, color: '#555' }}>{prod.couleurs[color]}</span>
          </div>
          <div style={{ display: 'flex', gap: 9, flexWrap: 'wrap' }}>
            {prod.couleurs.map((c, i) => (
              <div key={i} onClick={() => setColor(i)} title={c}
                style={{ width: 26, height: 26, borderRadius: '50%', cursor: 'pointer',
                  background: COULEURS[c] || '#888',
                  border: `2px solid ${color === i ? C.DK : 'transparent'}`,
                  transform: color === i ? 'scale(1.15)' : 'scale(1)', transition: 'all .15s' }} />
            ))}
          </div>
        </div>

        {/* SIZES */}
        {prod.tailles.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 9 }}>
              <div style={{ fontSize: 11, ...AF, fontWeight: 700, letterSpacing: 1 }}>{tr.size}</div>
              <div style={{ fontSize: 11, fontFamily: 'Inter,sans-serif', color: C.T,
                cursor: 'pointer', textDecoration: 'underline' }}>{tr.sizeGuide}</div>
            </div>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              {prod.tailles.map(s => (
                <button key={s} onClick={() => setSize(s)}
                  style={{ border: `1px solid ${size === s ? C.DK : '#ddd'}`,
                    background: size === s ? C.DK : 'white',
                    color: size === s ? 'white' : C.DK,
                    padding: '9px 11px', fontFamily: 'Inter,sans-serif',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer', minWidth: 48,
                    transition: 'all .15s' }}>
                  {s}
                </button>
              ))}
            </div>
            {errs.size && <div style={{ fontSize: 10, color: '#e05050', marginTop: 5, ...AF }}>⚠️ {errs.size}</div>}
          </div>
        )}

        {/* ORDER FORM */}
        <OrderForm lang={lang} form={form} setForm={setForm} errs={errs}
          onSubmit={commander} prix={prod.prix} currency={tr.currency} />

        {/* COMMANDER BUTTON */}
        <button onClick={commander} disabled={loading}
          style={{ width: '100%', padding: '14px', background: loading ? '#94a3b8' : C.T,
            color: 'white', fontSize: 13, ...AF, fontWeight: 700, border: 'none',
            cursor: loading ? 'not-allowed' : 'pointer', marginBottom: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <span>{loading ? '...' : tr.orderBtn}</span>
          <span style={{ background: 'rgba(255,255,255,.2)', borderRadius: 4,
            padding: '3px 10px', fontSize: 14, fontWeight: 900 }}>
            {prod.prix} {tr.currency}
          </span>
        </button>
        <div style={{ textAlign: 'center', fontSize: 10, ...AF, color: '#aaa', marginBottom: 28 }}>
          {tr.guarantee}
        </div>

        {/* HOOK 01 */}
        <div style={{ margin: '0 -14px', background: '#0a0a0a' }}>
          <div style={{ padding: '24px 18px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: C.GD, fontFamily: 'Inter,sans-serif',
              fontWeight: 700, marginBottom: 6 }}>
              {lang === 'fr' ? 'HOOK #01' : 'الميزة الأولى'}
            </div>
            <h2 style={{ ...AF, fontWeight: 900, fontSize: 24, color: 'white',
              lineHeight: 1.25, marginBottom: 10 }}>{tr.h1title}</h2>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,.55)', ...AF, lineHeight: 1.8,
              maxWidth: 280, margin: '0 auto' }}>{tr.h1sub}</p>
          </div>
          {prod.lifestyle.length >= 2 && (
            <div>
              {prod.lifestyle.slice(0, 2).map((src, i) => (
                <div key={i} style={{ marginTop: i > 0 ? 2 : 0 }}>
                  <img src={src} alt="" style={{ width: '100%', height: 'auto', display: 'block' }} />
                  <div style={{ background: '#111', padding: '10px 14px', textAlign: 'center' }}>
                    <div style={{ fontSize: 9, letterSpacing: 3, color: C.GD,
                      fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>
                      {i === 0 ? (lang === 'fr' ? 'NATURE' : 'الطبيعة') : (lang === 'fr' ? 'URBAN' : 'المدينة')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* Materials */}
          <div style={{ display: 'flex', justifyContent: 'space-around',
            padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,.07)' }}>
            {(lang === 'fr'
              ? [['Vibram','Semelle'],['Cuir naturel','Tige'],['Cuir bœuf','Doublure']]
              : [['فيبرام','النعل'],['جلد طبيعي','السطح'],['جلد بقري','البطانة']]
            ).map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'white', fontFamily: tr.font }}>{v}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,.38)', fontFamily: tr.font, marginTop: 2 }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* HOOK 02 */}
        {prod.lifestyle.length >= 1 && (
          <div style={{ margin: '0 -14px' }}>
            <img src={prod.lifestyle[0]} alt="" style={{ width: '100%', aspectRatio: '16/9',
              objectFit: 'cover', objectPosition: 'top', display: 'block' }} />
            <div style={{ background: '#111', padding: '24px 18px 26px' }}>
              <div style={{ fontSize: 9, letterSpacing: 4, color: C.GD, fontFamily: 'Inter,sans-serif',
                fontWeight: 700, marginBottom: 10 }}>
                {lang === 'fr' ? 'HOOK #02 · SAVOIR-FAIRE' : 'الميزة الثانية · الحرفية'}
              </div>
              <h2 style={{ ...AF, fontWeight: 900, fontSize: 26, color: 'white',
                lineHeight: 1.3, marginBottom: 10 }}>{tr.h2quote}</h2>
              <div style={{ width: 36, height: 2, background: C.GD, marginBottom: 12 }} />
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,.65)', ...AF, lineHeight: 1.85, marginBottom: 18 }}>
                {tr.h2text}
              </p>
              <div style={{ display: 'flex', gap: 24 }}>
                {(lang === 'fr'
                  ? [['Fès','Origine'],['100%','Artisanal'],['2 ans','Garantie']]
                  : [['فاس','المدينة'],['100%','يدوي'],['سنتان','الضمان']]
                ).map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: C.GD, fontFamily: 'Inter,sans-serif' }}>{v}</div>
                    <div style={{ fontSize: 9, color: 'rgba(255,255,255,.4)', ...AF, marginTop: 2 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HOOK 03 */}
        <div style={{ margin: '0 -14px', background: '#f5f3ef' }}>
          <div style={{ padding: '22px 16px 14px', textAlign: 'center' }}>
            <div style={{ fontSize: 9, letterSpacing: 4, color: C.T, fontFamily: 'Inter,sans-serif',
              fontWeight: 700, marginBottom: 6 }}>
              {lang === 'fr' ? 'HOOK #03 · LE CUIR' : 'الميزة الثالثة · الجلد'}
            </div>
            <h2 style={{ ...AF, fontWeight: 900, fontSize: 20, color: C.DK, lineHeight: 1.3 }}>
              {tr.h3title}
            </h2>
          </div>
          {prod.imgs.length > 1 && (
            <img src={prod.imgs[1]} alt="" style={{ width: '100%', aspectRatio: '16/9',
              objectFit: 'cover', objectPosition: 'center', display: 'block' }} />
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
            background: '#ddd8d0', marginTop: 1 }}>
            {(lang === 'fr'
              ? [['🌿','Tannage végétal','Sans chrome, naturel'],['🪡','Couture main','Double fil ciré'],['🔶','Brogue décoré','Perforation artisanale'],['⚫','Semelle Vibram','Grip maximal']]
              : [['🌿','دباغة نباتية','بدون كيمياء'],['🪡','خياطة يدوية','خيط شمعي مزدوج'],['🔶','نقش بروغ','زخرفة بالثقب'],['⚫','نعل فيبرام','أقصى تثبيت']]
            ).map(([icon, title, desc]) => (
              <div key={title} style={{ background: '#f5f3ef', padding: '14px 12px',
                display: 'flex', gap: 9, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 700, ...AF, color: C.DK, marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 11, color: '#888', ...AF, lineHeight: 1.5 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACCORDION */}
        <div style={{ paddingTop: 18, marginBottom: 22 }}>
          {Object.entries(tr.accordion).map(([key, [title, body]]) => (
            <div key={key} style={{ borderBottom: '1px solid #e8e3dc' }}>
              <div onClick={() => setAcc(acc === key ? '' : key)}
                style={{ padding: '14px 0', cursor: 'pointer', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center',
                  ...AF, fontSize: 16, fontWeight: 600 }}>
                <span>{title}</span>
                <span style={{ fontSize: 14, color: '#aaa' }}>{acc === key ? '∧' : '∨'}</span>
              </div>
              {acc === key && (
                <div style={{ padding: '0 0 14px', ...AF, fontSize: 13, color: '#555', lineHeight: 1.9 }}>
                  {body}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* REVIEWS */}
        <div style={{ background: '#f8f6f2', margin: '0 -14px', padding: '22px 14px 28px' }}>
          <div style={{ fontSize: 18, fontFamily: 'Georgia,serif', fontWeight: 600, marginBottom: 14 }}>
            {tr.reviews}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
            <span style={{ fontSize: 32, fontWeight: 900, fontFamily: 'Inter,sans-serif' }}>4.9</span>
            <div>
              <Stars n={5} />
              <div style={{ fontSize: 11, color: '#aaa', fontFamily: 'Inter,sans-serif', marginTop: 2 }}>
                147 {tr.ratingLabel}
              </div>
            </div>
          </div>
          {tr.reviewData.map((r, i) => (
            <div key={i} style={{ paddingBottom: 18, marginBottom: 18,
              borderBottom: i < tr.reviewData.length - 1 ? '1px solid #e8e3dc' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                <span style={{ fontFamily: 'Inter,sans-serif', fontWeight: 700,
                  fontSize: 12, color: C.T }}>{r.name}</span>
                <span style={{ fontSize: 10, color: '#aaa', fontFamily: 'Inter,sans-serif' }}>{r.city}</span>
              </div>
              <Stars n={r.stars} />
              <div style={{ fontFamily: 'Georgia,serif', fontStyle: 'italic', fontSize: 15,
                color: C.DK, margin: '5px 0 4px' }}>"{r.title}"</div>
              <div style={{ ...AF, fontSize: 13, color: '#555', lineHeight: 1.8 }}>{r.body}</div>
            </div>
          ))}
        </div>

        {/* URGENCY */}
        <div style={{ background: '#fff8ee', borderTop: '2px solid #f0d8a0',
          borderBottom: '2px solid #f0d8a0', padding: '13px 14px',
          display: 'flex', alignItems: 'center', gap: 12, margin: '0 -14px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#e05050',
            flexShrink: 0, boxShadow: '0 0 0 3px rgba(224,80,80,.2)' }} />
          <div style={{ ...AF, fontSize: 13 }}>
            <span style={{ fontWeight: 700, color: '#c0392b' }}>
              {prod.badge ? prod.badge[lang] || tr.urgency : tr.urgency}
            </span>
            <span style={{ color: '#888', marginLeft: 4 }}>{tr.urgencySub}</span>
          </div>
        </div>

        {/* TRUST BADGES */}
        <div style={{ background: 'white', padding: '20px 0', margin: '0' }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: '#aaa', ...AF,
            fontWeight: 700, textAlign: 'center', marginBottom: 14 }}>
            {tr.whyFaris}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9 }}>
            {tr.badges.map(b => (
              <div key={b.t} style={{ display: 'flex', gap: 9, alignItems: 'flex-start',
                padding: '11px 10px', background: '#f8f6f2', borderRadius: 2 }}>
                <span style={{ fontSize: 18, flexShrink: 0 }}>{b.icon}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, ...AF, color: C.DK }}>{b.t}</div>
                  <div style={{ fontSize: 10, color: '#888', ...AF, marginTop: 1, lineHeight: 1.4 }}>{b.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div style={{ background: 'white', padding: '18px 0', marginBottom: 2 }}>
          <div style={{ fontSize: 10, letterSpacing: 2, color: '#aaa', ...AF,
            fontWeight: 700, marginBottom: 14 }}>{tr.faqTitle}</div>
          {tr.faq.map(([q, a], i) => (
            <div key={i} style={{ borderBottom: '1px solid #f0ebe3' }}>
              <div onClick={() => setAcc(acc === 'faq' + i ? '' : 'faq' + i)}
                style={{ padding: '12px 0', cursor: 'pointer', display: 'flex',
                  justifyContent: 'space-between', alignItems: 'center',
                  ...AF, fontSize: 13, fontWeight: 600, color: C.DK }}>
                <span>{q}</span>
                <span style={{ color: C.T, fontSize: 18, fontWeight: 300 }}>
                  {acc === 'faq' + i ? '−' : '+'}
                </span>
              </div>
              {acc === 'faq' + i && (
                <div style={{ padding: '0 0 12px', ...AF, fontSize: 13, color: '#555', lineHeight: 1.85 }}>{a}</div>
              )}
            </div>
          ))}
        </div>

        {/* FINAL CTA */}
        <div style={{ background: C.DK, padding: '26px 14px', margin: '0 -14px', textAlign: 'center' }}>
          <div style={{ fontFamily: "'Pinyon Script',cursive", fontSize: 32, color: 'white', marginBottom: 4 }}>Faris</div>
          <div style={{ fontSize: 9, letterSpacing: 2, color: 'rgba(255,255,255,.4)', ...AF, marginBottom: 14 }}>
            {tr.cuirMarocain}
          </div>
          <div style={{ ...AF, fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 6, lineHeight: 1.4 }}>
            {tr.finalSlogan}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,.55)', ...AF, marginBottom: 20, lineHeight: 1.8 }}>
            {tr.finalSub}
          </div>
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            style={{ width: '100%', padding: '14px', background: C.T, color: 'white',
              fontSize: 13, ...AF, fontWeight: 700, border: 'none', cursor: 'pointer',
              marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
            <span>{tr.orderBtn}</span>
            <span style={{ background: 'rgba(255,255,255,.2)', borderRadius: 4,
              padding: '3px 10px', fontSize: 14, fontWeight: 900 }}>
              {prod.prix} {tr.currency}
            </span>
          </button>
        </div>
      </div>

      <WhatsApp onToast={toast$} />
    </div>
  )
}
