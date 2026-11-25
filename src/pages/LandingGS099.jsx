import React, { useState, useEffect, useRef } from 'react'
import { createOrder, fbPixel, ttPixel } from '../api/client.js'

// ── GS099 LANDING PAGES (A/B test, Arabic + French) ───────────
// Routes: #gs/ar/01..07 · #gs/fr/01..07   (one link per language: #gs-ar · #gs-fr)
// Images: public/products/gs099/<ar|fr>/<XX>/<n>.jpg

export const GS_CAMPAIGN = { ar: 'gs099-ar', fr: 'gs099-fr' }

const NAME    = 'GS099'
const COLORS  = ['Noir', 'Marron']
const SIZES   = [39, 40, 41, 42, 43, 44]
const OFFERS  = [{ qty: 1, prix: 429 }, { qty: 2, prix: 690 }]

// image sizes (width x height) — same layout for AR and FR
const DIMS = {
  '01': [[1440,2600],[1440,2373],[1440,2527],[1440,2240],[1440,2527]],
  '02': [[1440,2527],[1440,2804],[1440,2240],[1440,2527],[1440,2240]],
  '03': [[1440,2527],[1440,2373],[1440,2240],[1440,2240],[1440,2240]],
  '04': [[1440,2527],[1440,2440],[1440,2173],[1440,3031],[1440,2613]],
  '05': [[1440,2527],[1440,2373],[1440,2460],[1440,2240],[1440,2527]],
  '06': [[1440,2240],[1440,2804],[1440,2173],[1440,2240],[1440,2240]],
  '07': [[1440,2240],[1440,2373],[1440,2173],[1440,2460],[1440,3404]]
}
export const GS_PAGE_IDS = Object.keys(DIMS)

// ── NEW SET 24-11: 4 Darija (DA1-4) + 4 Fousha (FU1-4), one link #gs099 ──
// Images: public/products/gs099/mix/<id>/<n>.jpg · form in Arabic
const MIX_DIMS = {
  DA1: [[1440,2240],[1440,2373],[1440,2240],[1440,2240],[1440,2240]],
  DA2: [[1440,2240],[1440,2373],[1440,2527],[1440,2527],[1440,2671]],
  DA3: [[1440,2240],[1440,2373],[1440,2240],[1440,2527],[1440,2527]],
  DA4: [[1440,3031],[1440,2373],[1440,2240],[1440,2600],[1440,2613]],
  FU1: [[1440,2240],[1440,2373],[1440,2240],[1440,2240],[1440,2240]],
  FU2: [[1440,2240],[1440,2373],[1440,2527],[1440,2527],[1440,2671]],
  FU3: [[1440,2240],[1440,2373],[1440,2240],[1440,2527],[1440,2527]],
  FU4: [[1440,3031],[1440,2373],[1440,2240],[1440,2600],[1440,2613]]
}
export const GS_MIX = { campaign: 'gs099-mix', ids: Object.keys(MIX_DIMS) }

const TXT = {
  ar: {
    dir: 'rtl',
    tag: 'عرض محدود', from: 'ابتداءً من اليوم',
    one: 'حذاء واحد', two: 'جوج أحذية', cur: 'درهم', at: 'بـ',
    save: 'وفر 168 درهم',
    title: <>اطلب <span>GS099</span> دابا</>,
    sub: 'الدفع عند الاستلام · التوصيل لجميع المدن',
    color: 'اللون', size: 'المقاس', shoe: i => 'الحذاء ' + (i === 0 ? 'الأول' : 'الثاني'),
    colorName: { Noir: 'كحل', Marron: 'قهوي' },
    nom: 'الاسم الكامل', tel: 'رقم الهاتف (06 / 07)', ville: 'المدينة', adresse: 'العنوان',
    quartier: '— اختار المقاطعة —', other: 'حي آخر',
    cta: p => `أكد الطلب — ${p} درهم`, sticky: p => `اطلب دابا — ${p} درهم`,
    trust: ['🚚', 'توصيل سريع', '💵', 'الدفع عند الاستلام', '🔁', 'تبديل المقاس'],
    eSize: 'اختار المقاس', eNom: 'دخل الاسم الكامل', eTel: 'رقم الهاتف خاصو يكون 06 ولا 07 + 8 أرقام',
    eVille: 'كتب المدينة', eQuartier: 'اختار المقاطعة ديالك فكازا', eAdresse: 'دخل العنوان',
    eGen: 'وقع مشكل، عاود من فضلك',
    okTitle: <>شكراً! <span>الطلب ديالك توصلنا</span></>,
    okSub: 'غادي نتاصلو بيك فأقرب وقت باش نأكدو الطلب', okRef: 'رقم الطلب:',
    ticker: ['🚚 التوصيل مجاني', '💵 الدفع عند الاستلام', '📦 حل الكولي وقلّب قبل ما تخلص']
  },
  fr: {
    dir: 'ltr',
    tag: 'Offre limitée', from: "à partir d'aujourd'hui",
    one: '1 paire', two: '2 paires', cur: 'DH', at: 'à ',
    save: 'Économisez 168 DH',
    title: <>Commandez <span>GS099</span> maintenant</>,
    sub: 'Paiement à la livraison · Livraison partout au Maroc',
    color: 'Couleur', size: 'Pointure', shoe: i => (i === 0 ? '1ʳᵉ' : '2ᵉ') + ' paire',
    colorName: { Noir: 'Noir', Marron: 'Marron' },
    nom: 'Nom complet', tel: 'Téléphone (06 / 07)', ville: 'Ville', adresse: 'Adresse',
    quartier: '— Choisissez le quartier —', other: 'Autre quartier',
    cta: p => `Confirmer la commande — ${p} DH`, sticky: p => `Commander — ${p} DH`,
    trust: ['🚚', 'Livraison rapide', '💵', 'Paiement à la livraison', '🔁', 'Échange de taille'],
    eSize: 'Choisissez la pointure', eNom: 'Entrez votre nom complet', eTel: 'Le numéro doit commencer par 06 ou 07 (10 chiffres)',
    eVille: 'Entrez votre ville', eQuartier: 'Choisissez votre quartier à Casablanca', eAdresse: 'Entrez votre adresse',
    eGen: 'Une erreur est survenue, réessayez',
    okTitle: <>Merci ! <span>Commande reçue</span></>,
    okSub: 'Nous vous appelons très vite pour confirmer la commande', okRef: 'N° de commande :',
    ticker: ['🚚 Livraison gratuite', '💵 Paiement à la livraison', '📦 Ouvrez le colis avant de payer']
  }
}

const CASA_QUARTIERS = [
  'Sidi Maarouf','Lissasfa','Moulay Rachid','Sidi Othmane','Sbata','Beauséjour','Oasis',
  'Bourgogne','Ain Diab','Centre Ville','Derb Omar','Derb Sultan','Oulfa','Mers Sultan',
  'Maarif','Ain Chock','Californie','Hay Hassani','Bernoussi','Ain Sebaa','Anassi',
  'Sidi Moumen','Hay Mohammadi','Ain Borja','Roches Noires','Anfa','Sidi Hajjaj',
  'Tacharouk','Lahraouyine','Bournazel'
]
const isCasa = v => {
  const s = (v || '').trim().toLowerCase().replace(/\s+/g, ' ')
  if (!s) return false
  return /^(casa|casablanca|casa blanca|kaza|kasa|dar el beida|dar beida)\b/.test(s) ||
    /^(كازا|كازابلانكا|كازا بلانكا|الدار البيضاء|الدارالبيضاء|البيضاء|الدار البيضا|البيضا)/.test(s)
}
const normalizePhone = v => {
  let s = String(v || '')
    .replace(/[٠-٩]/g, d => String(d.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, d => String(d.charCodeAt(0) - 0x06F0))
    .replace(/[^\d+]/g, '')
  if (s.startsWith('+')) s = s.slice(1)
  if (s.startsWith('00212')) s = '0' + s.slice(5)
  else if (s.startsWith('212')) s = '0' + s.slice(3)
  if (s.startsWith('00')) s = s.slice(1)
  if (/^[67]\d{8}$/.test(s)) s = '0' + s
  return s
}
const todayStr = () => {
  const d = new Date()
  return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear()
}

// ── TRACKING (campaign-based: /api/lp2/*) ─────────────────────
const post = (url, body) =>
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).catch(() => {})
const ss = {
  get: k => { try { return sessionStorage.getItem(k) } catch { return null } },
  set: (k, v) => { try { sessionStorage.setItem(k, v) } catch {} }
}

const BG = '#000', CARD = '#0d0b09', GOLD = '#c8a27a', LINE = '#5a4632'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
  .gs { background:${BG}; min-height:100vh; font-family:'Tajawal',sans-serif; color:#f3ece4; }
  .gs-wrap { max-width:560px; margin:0 auto; background:${BG}; }
  .gs-img { display:block; width:100%; height:auto; background:#111; }
  .gs-form { padding:22px 16px 110px; }
  .gs-box { background:${CARD}; border:1px solid ${LINE}; border-radius:18px; padding:18px 16px; }
  .gs-h { text-align:center; font-size:22px; font-weight:900; margin:0 0 4px; }
  .gs-h span { color:${GOLD}; }
  .gs-sub { text-align:center; font-size:13px; color:#a8998a; margin-bottom:16px; }
  .gs-offers { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px; }
  .gs-offer { position:relative; border:1.5px solid ${LINE}; border-radius:14px; padding:12px 8px;
    text-align:center; cursor:pointer; background:#000; color:#f3ece4; font-family:inherit; }
  .gs-offer.on { background:${GOLD}; border-color:${GOLD}; color:#1a120a; }
  .gs-offer b { display:block; font-size:24px; font-weight:900; margin-top:2px; }
  .gs-save { position:absolute; top:-10px; left:50%; transform:translateX(-50%); white-space:nowrap;
    background:#c0392b; color:#fff; font-size:10px; font-weight:800; padding:2px 8px; border-radius:20px; }
  .gs-lbl { font-size:13px; color:#a8998a; margin:12px 0 6px; font-weight:700; }
  .gs-chips { display:flex; gap:6px; flex-wrap:wrap; }
  .gs-chip { padding:8px 12px; border-radius:10px; border:1.5px solid ${LINE}; background:#000;
    color:#f3ece4; font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; min-width:44px; }
  .gs-chip.on { background:${GOLD}; border-color:${GOLD}; color:#1a120a; }
  .gs-pair { border-top:1px dashed ${LINE}; margin-top:12px; padding-top:4px; }
  .gs-in { width:100%; box-sizing:border-box; padding:13px 14px; margin-top:10px; border-radius:12px;
    border:1.5px solid ${LINE}; background:#000; color:#fff; font-family:inherit; font-size:15px; outline:none; }
  .gs-in:focus { border-color:${GOLD}; }
  .gs-in.bad, .gs-chips.bad { border-color:#ff6b5a !important; box-shadow:0 0 0 2px rgba(255,107,90,.25); }
  .gs-chips.bad { border:1.5px solid #ff6b5a; border-radius:12px; padding:6px; }
  .gs-ferr { color:#ff8a7a; font-size:12.5px; font-weight:700; margin-top:5px; }
  .gs-cta { width:100%; margin-top:16px; padding:16px; border:none; border-radius:14px; cursor:pointer;
    background:${GOLD}; color:#1a120a; font-family:inherit; font-size:18px; font-weight:900; animation:gsPulse 1.8s infinite; }
  .gs-cta:disabled { opacity:.6; animation:none; }
  .gs-err { margin-top:10px; color:#ff8a7a; font-size:13px; text-align:center; font-weight:700; }
  .gs-trust { display:flex; justify-content:space-around; margin-top:14px; font-size:11px; color:#a8998a; text-align:center; }
  .gs-sticky { position:fixed; bottom:0; left:0; right:0; z-index:50; padding:10px 12px;
    background:linear-gradient(to top, #000 70%, rgba(0,0,0,0)); }
  .gs-sticky button { display:block; width:100%; max-width:536px; margin:0 auto; padding:15px; border:none; border-radius:14px;
    background:${GOLD}; color:#1a120a; font-family:'Tajawal',sans-serif; font-size:17px; font-weight:900; cursor:pointer;
    box-shadow:0 6px 24px rgba(200,162,122,.35); }
  @keyframes gsPulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.025) } }
  .gs-banner { position:sticky; top:0; z-index:60; overflow:hidden; display:flex; align-items:center; justify-content:center; gap:10px;
    background:linear-gradient(180deg,#1c140c 0%,#0b0805 100%); color:#f3ece4; text-align:center;
    padding:9px 10px; font-size:13.5px; font-weight:700; line-height:1.55;
    border-bottom:1px solid ${GOLD}; box-shadow:0 4px 18px rgba(0,0,0,.6); }
  .gs-banner::after { content:''; position:absolute; top:0; bottom:0; width:40%; left:-50%;
    background:linear-gradient(100deg,transparent,rgba(200,162,122,.16),transparent);
    animation:gsShine 3.8s ease-in-out infinite; pointer-events:none; }
  .gs-banner-txt { position:relative; z-index:1; }
  .gs-banner b, .gs-banner .gs-tag { color:${GOLD}; font-weight:900; }
  .gs-banner .gs-tag { font-size:14.5px; }
  .gs-flame { position:relative; z-index:1; display:inline-block; font-size:22px; line-height:1; transform-origin:50% 90%;
    filter:drop-shadow(0 0 6px rgba(255,140,40,.75)); animation:gsFlicker 1.1s ease-in-out infinite alternate; }
  .gs-flame.r { animation-delay:-.55s; animation-duration:1.25s; }
  @keyframes gsFlicker {
    0%   { transform:scale(1) rotate(-3deg); filter:drop-shadow(0 0 5px rgba(255,140,40,.6)) brightness(1); }
    25%  { transform:scale(1.12,1.18) rotate(2deg); filter:drop-shadow(0 0 10px rgba(255,170,60,.95)) brightness(1.15); }
    50%  { transform:scale(.95,1.05) rotate(-2deg); filter:drop-shadow(0 0 6px rgba(255,120,30,.7)) brightness(.95); }
    75%  { transform:scale(1.08,1.14) rotate(3deg); filter:drop-shadow(0 0 12px rgba(255,180,70,1)) brightness(1.2); }
    100% { transform:scale(1,1.08) rotate(-1deg); filter:drop-shadow(0 0 7px rgba(255,150,50,.8)) brightness(1.05); }
  }
  @keyframes gsShine { 0% { left:-50% } 60%,100% { left:120% } }
  @media (prefers-reduced-motion: reduce) { .gs-flame, .gs-banner::after, .gs-cta { animation:none; } }
  .gs-ticker { position:sticky; top:0; z-index:60; overflow:hidden; white-space:nowrap;
    background:${GOLD}; color:#1a120a; border-bottom:1px solid #8e6f4d; box-shadow:0 4px 14px rgba(0,0,0,.5); }
  .gs-ticker .gs-track { display:inline-flex; gap:38px; padding:10px 0; font-weight:800; font-size:14px;
    animation:gsTickR 16s linear infinite; }
  .gs-ticker.ltr .gs-track { animation-name:gsTickL; }
  .gs-ticker .gs-track span { display:inline-flex; align-items:center; gap:6px; }
  @keyframes gsTickR { from { transform:translateX(0) } to { transform:translateX(50%) } }
  @keyframes gsTickL { from { transform:translateX(0) } to { transform:translateX(-50%) } }
  @media (prefers-reduced-motion: reduce) { .gs-ticker .gs-track { animation:none; } }
`

export default function LandingGS099({ lang, id, set: pageSet }) {
  const mix  = pageSet === 'mix'
  const L    = mix ? 'ar' : (lang === 'fr' ? 'fr' : 'ar')
  const T    = TXT[L]
  const c    = mix ? GS_MIX.campaign : GS_CAMPAIGN[L]
  const dims = mix ? MIX_DIMS : DIMS
  const lp   = dims[id] ? id : Object.keys(dims)[0]
  const imgs = dims[lp]
  const key  = c + '_' + lp
  const imgBase = mix ? `/products/gs099/mix/${lp}/` : `/products/gs099/${L}/${lp}/`
  const pxName  = mix ? `GS099 MIX ${lp}` : `GS099 ${L.toUpperCase()} P${lp}`

  const [offer,    setOffer]    = useState(0)
  const [pairs,    setPairs]    = useState([{ couleur: COLORS[0], taille: '' }, { couleur: COLORS[0], taille: '' }])
  const [form,     setForm]     = useState({ nom: '', tel: '', adresse: '', ville: '' })
  const [quartier, setQuartier] = useState('')
  const [error,    setError]    = useState('')
  const [errField, setErrField] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(null)
  const [showSticky, setShowSticky] = useState(true)
  const formRef = useRef(null)
  const t0 = useRef(Date.now())

  // visit (once per session per page) + landing time
  useEffect(() => {
    window.scrollTo(0, 0)
    const saved = ss.get('lp2_t0_' + key)
    if (saved) t0.current = parseInt(saved, 10)
    else { ss.set('lp2_t0_' + key, String(t0.current)); post('/api/lp2/event', { c, lp, type: 'visit' }) }
    fbPixel('ViewContent', { content_name: pxName, value: OFFERS[0].prix, currency: 'MAD' })
    ttPixel('ViewContent', { content_id: 'GS099', content_type: 'product', content_name: pxName, value: OFFERS[0].prix, currency: 'MAD' })
  }, [key])

  // form reached + hide sticky button while the form is visible
  useEffect(() => {
    const el = formRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => {
      setShowSticky(!e.isIntersecting)
      if (e.isIntersecting && !ss.get('lp2_form_' + key)) {
        ss.set('lp2_form_' + key, '1'); post('/api/lp2/event', { c, lp, type: 'form' })
        ttPixel('InitiateCheckout', { content_id: 'GS099', content_type: 'product', content_name: pxName, value: OFFERS[0].prix, currency: 'MAD' })
      }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [key])

  // time on page (visible only), sent when leaving / hiding
  useEffect(() => {
    let start = document.visibilityState === 'visible' ? Date.now() : null
    const flush = () => {
      if (start === null) return
      const ms = Date.now() - start
      start = null
      if (ms < 500) return
      const first = !ss.get('lp2_stay_' + key)
      ss.set('lp2_stay_' + key, '1')
      const body = JSON.stringify({ c, lp, ms, first })
      try {
        if (navigator.sendBeacon) navigator.sendBeacon('/api/lp2/stay', new Blob([body], { type: 'application/json' }))
        else fetch('/api/lp2/stay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
      } catch {}
    }
    const onVis = () => { if (document.visibilityState === 'hidden') flush(); else if (start === null) start = Date.now() }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pagehide', flush)
    return () => { flush(); document.removeEventListener('visibilitychange', onVis); window.removeEventListener('pagehide', flush) }
  }, [key])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const setPair = (i, k, v) => setPairs(ps => ps.map((p, j) => j === i ? { ...p, [k]: v } : p))
  const goForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const o = OFFERS[offer]
  const used = pairs.slice(0, o.qty)

  const fail = (field, msg) => {
    setError(msg); setErrField(field)
    post('/api/lp2/formerror', { c, lp, field })
    setTimeout(() => {
      const el = document.getElementById('gs-f-' + field)
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (el.focus && el.tagName !== 'DIV') el.focus() }
    }, 30)
  }
  const ferr = f => errField === f && error ? <div className="gs-ferr">⚠️ {error}</div> : null

  const submit = async () => {
    const tel = normalizePhone(form.tel)
    if (tel !== form.tel) setForm(f => ({ ...f, tel }))
    const noSize = used.findIndex(p => !p.taille)
    if (noSize !== -1)                   return fail('taille' + noSize, T.eSize)
    if (!form.nom.trim())                return fail('nom', T.eNom)
    if (!/^0[67]\d{8}$/.test(tel))       return fail('tel', T.eTel)
    if (!form.ville.trim())              return fail('ville', T.eVille)
    if (isCasa(form.ville) && !quartier) return fail('quartier', T.eQuartier)
    if (!form.adresse.trim())            return fail('adresse', T.eAdresse)
    setError(''); setErrField(''); setLoading(true)
    try {
      // clean order: "GS099 Noir 42" / "GS099 Noir 42 + GS099 Marron 43"
      const last   = used[used.length - 1]
      const before = used.slice(0, -1).map(p => `${NAME} ${p.couleur} ${p.taille} + `).join('')
      const ville  = isCasa(form.ville) ? `Casablanca - ${quartier}` : form.ville.trim()
      const res = await createOrder({
        ...form, tel, ville,
        couleur: last.couleur,
        taille:  last.taille,
        produit: `${before}${NAME}`,
        prix: o.prix, langue: L
      })
      if (!res || !res.success) {
        post('/api/lp2/formerror', { c, lp, field: 'server_' + (res?.field || 'other') })
        if (res?.field) return fail(res.field, res.error || T.eGen)
        setError(res?.error || T.eGen); return
      }
      const ms = Date.now() - t0.current
      if (!ss.get('lp2_order_' + key + '_' + res.ref)) {
        ss.set('lp2_order_' + key + '_' + res.ref, '1')
        post('/api/lp2/event', { c, lp, type: 'order', ms, qty: o.qty, prix: o.prix, ref: res.ref })
      }
      fbPixel('Purchase', { value: o.prix, currency: 'MAD', content_name: pxName, num_items: o.qty })
      const ttOrder = { content_id: 'GS099', content_type: 'product', content_name: pxName, quantity: o.qty, value: o.prix, currency: 'MAD' }
      ttPixel('PlaceAnOrder', ttOrder)
      ttPixel('CompletePayment', ttOrder)
      setSuccess(res)
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
    } catch (e) {
      post('/api/lp2/formerror', { c, lp, field: 'network' })
      setError(T.eGen)
    } finally { setLoading(false) }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="gs" dir={T.dir}>
        <div className="gs-wrap">

          {/* ticker banner: free delivery · pay on delivery · open the parcel (no prices) */}
          <div className={'gs-ticker' + (T.dir === 'ltr' ? ' ltr' : '')} aria-label={T.ticker.join(' · ')}>
            <div className="gs-track" aria-hidden="true">
              {[0, 1, 2, 3].flatMap(k => T.ticker.map((t, i) => <span key={k + '-' + i}>{t}</span>))}
            </div>
          </div>

          {imgs.map(([w, h], i) => (
            <img key={i} className="gs-img" src={`${imgBase}${i + 1}.jpg`}
              width={w} height={h} alt={`GS099 ${i + 1}`}
              loading={i < 2 ? 'eager' : 'lazy'} fetchpriority={i === 0 ? 'high' : 'auto'} decoding="async" />
          ))}

          <div className="gs-form" ref={formRef}>
            <div className="gs-box">
              {success ? (
                <div style={{ textAlign: 'center', padding: '18px 0' }}>
                  <div style={{ fontSize: 46 }}>✅</div>
                  <div className="gs-h">{T.okTitle}</div>
                  <div className="gs-sub" style={{ marginTop: 8 }}>{T.okSub}</div>
                  <div style={{ fontSize: 13, color: GOLD, fontWeight: 800 }}>{T.okRef} {success.ref}</div>
                </div>
              ) : (
                <>
                  <div className="gs-h">{T.title}</div>
                  <div className="gs-sub">{T.sub}</div>

                  <div className="gs-offers">
                    {OFFERS.map((of, i) => (
                      <button key={i} className={'gs-offer' + (offer === i ? ' on' : '')} onClick={() => setOffer(i)}>
                        {i === 1 && <span className="gs-save">{T.save}</span>}
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{i === 0 ? T.one : T.two}</span>
                        <b>{of.prix} {T.cur}</b>
                      </button>
                    ))}
                  </div>

                  {used.map((p, i) => (
                    <div key={i} className={i > 0 ? 'gs-pair' : ''}>
                      {o.qty > 1 && <div className="gs-lbl" style={{ color: GOLD }}>{T.shoe(i)}</div>}
                      <div className="gs-lbl">{T.color}</div>
                      <div className="gs-chips">
                        {COLORS.map(col => (
                          <button key={col} className={'gs-chip' + (p.couleur === col ? ' on' : '')}
                            onClick={() => setPair(i, 'couleur', col)}>{T.colorName[col]}</button>
                        ))}
                      </div>
                      <div className="gs-lbl">{T.size}</div>
                      <div id={'gs-f-taille' + i} className={'gs-chips' + (errField === 'taille' + i ? ' bad' : '')}>
                        {SIZES.map(t => (
                          <button key={t} className={'gs-chip' + (p.taille === String(t) ? ' on' : '')}
                            onClick={() => { setPair(i, 'taille', String(t)); if (errField === 'taille' + i) { setErrField(''); setError('') } }}>{t}</button>
                        ))}
                      </div>
                      {ferr('taille' + i)}
                    </div>
                  ))}

                  <input id="gs-f-nom" className={'gs-in' + (errField === 'nom' ? ' bad' : '')} placeholder={T.nom}
                    value={form.nom} onChange={set('nom')} autoComplete="name" />
                  {ferr('nom')}
                  <input id="gs-f-tel" className={'gs-in' + (errField === 'tel' ? ' bad' : '')} placeholder={T.tel}
                    inputMode="tel" type="tel" autoComplete="tel" maxLength={20}
                    value={form.tel} onChange={set('tel')} onBlur={() => setForm(f => ({ ...f, tel: normalizePhone(f.tel) }))} />
                  {ferr('tel')}
                  <input id="gs-f-ville" className={'gs-in' + (errField === 'ville' ? ' bad' : '')} placeholder={T.ville}
                    value={form.ville} onChange={e => { set('ville')(e); if (!isCasa(e.target.value)) setQuartier('') }} />
                  {ferr('ville')}
                  {isCasa(form.ville) && (
                    <select id="gs-f-quartier" className={'gs-in' + (errField === 'quartier' ? ' bad' : '')} value={quartier}
                      onChange={e => setQuartier(e.target.value)} style={{ borderColor: quartier ? LINE : GOLD }}>
                      <option value="">{T.quartier}</option>
                      {CASA_QUARTIERS.map(q => <option key={q} value={q}>{q}</option>)}
                      <option value="Autre">{T.other}</option>
                    </select>
                  )}
                  {isCasa(form.ville) && ferr('quartier')}
                  <input id="gs-f-adresse" className={'gs-in' + (errField === 'adresse' ? ' bad' : '')} placeholder={T.adresse}
                    value={form.adresse} onChange={set('adresse')} autoComplete="street-address" />
                  {ferr('adresse')}

                  <button className="gs-cta" onClick={submit} disabled={loading}>{loading ? '...' : T.cta(o.prix)}</button>
                  {error && !errField && <div className="gs-err">{error}</div>}

                  <div className="gs-trust">
                    <span>{T.trust[0]}<br />{T.trust[1]}</span>
                    <span>{T.trust[2]}<br />{T.trust[3]}</span>
                    <span>{T.trust[4]}<br />{T.trust[5]}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {showSticky && !success && (
          <div className="gs-sticky"><button onClick={goForm}>{T.sticky(o.prix)}</button></div>
        )}
      </div>
    </>
  )
}
