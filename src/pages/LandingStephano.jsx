import React, { useState, useEffect, useRef } from 'react'
import { PRODUCTS } from '../data/products.js'
import { createOrder, fbPixel } from '../api/client.js'

// ── STÉPHANO LANDING PAGES (A/B/n test) ───────────────────────
// Each page = stacked images from public/products/stephano/lp/XX/
// Route: #lp/01 ... #lp/14

const P = PRODUCTS.find(p => p.slug === 'stephano') || PRODUCTS[0]

const OFFERS = [
  { qty: 1, prix: 330, old: 490, label: 'حذاء واحد' },
  { qty: 2, prix: 590, old: 980, label: 'جوج أحذية', save: 'وفر 70 درهم' }
]

// Casablanca: visitor types the city; if it's Casa we ask for the district
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
// Phone: accept 06/07 in any form (+212 6.., 00212 7.., spaces, dashes, Arabic digits) → 0612345678
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

// form errors (field only, no customer data) → admin, to see where visitors get stuck
const lpFormError = (lp, field) =>
  fetch('/api/lp/formerror', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lp, field })
  }).catch(() => {})

const todayStr = () => {
  const d = new Date()
  return String(d.getDate()).padStart(2, '0') + '/' + String(d.getMonth() + 1).padStart(2, '0') + '/' + d.getFullYear()
}

// image sizes (width x height) to avoid layout jumps while loading
export const LP_PAGES = {
  '01': [[1440,1677],[1440,1557],[1440,1837],[1440,2560],[1440,1677],[1440,2560]],
  '02': [[1440,1677],[1440,1837],[1440,2560],[1440,1677],[1440,2560]],
  '03': [[1440,1677],[1440,1557],[1440,1837],[1440,2560],[1440,1677],[1440,2560]],
  '04': [[1440,1677],[1440,1837],[1440,2560],[1440,1677],[1440,2560]],
  '05': [[1440,1677],[1440,1837],[1440,1557],[1440,2560],[1440,1677],[1440,2144]],
  '06': [[1440,1677],[1440,1837],[1440,2560],[1440,1677],[1440,2560]],
  '07': [[1440,1677],[1440,1557],[1440,1837],[1440,2560],[1440,1677],[1440,2560]],
  '08': [[1440,1677],[1440,1837],[1440,2560],[1440,1677],[1440,2560]],
  '09': [[1440,1677],[1440,1557],[1440,1837],[1440,2560],[1440,1677],[1440,2144]],
  '10': [[1440,1677],[1440,1837],[1440,2560],[1440,1677],[1440,2560],[1440,2560]],
  '11': [[1440,1717],[1440,2003],[1440,1904],[1440,2313],[1440,2313]],
  '12': [[1440,2353],[1440,2313],[1440,2088],[1440,2003],[1440,1837]],
  '13': [[1440,1717],[1440,1904],[1440,1757],[1440,1757],[1440,1757]],
  '14': [[1440,2353],[1440,2340],[1440,2313],[1440,2220],[1440,2313]]
}

const CITIES = [
  'الدار البيضاء','الرباط','فاس','مراكش','أكادير','طنجة',
  'مكناس','وجدة','القنيطرة','تطوان','الجديدة','سطات',
  'بني ملال','خريبكة','الناظور','أخرى'
]

const COLOR_AR = { 'Noir': 'أسود', 'Marron': 'بني', 'Gris ardoise': 'رمادي' }

const BG   = '#000'
const CARD = '#0d0b09'
const GOLD = '#c8a27a'
const LINE = '#5a4632'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800;900&display=swap');
  .lp { background:${BG}; min-height:100vh; font-family:'Tajawal',sans-serif; direction:rtl; color:#f3ece4; }
  .lp-wrap { max-width:560px; margin:0 auto; background:${BG}; }
  .lp-img { display:block; width:100%; height:auto; background:#111; }
  .lp-form { padding:22px 16px 110px; }
  .lp-box { background:${CARD}; border:1px solid ${LINE}; border-radius:18px; padding:18px 16px; }
  .lp-h { text-align:center; font-size:22px; font-weight:900; margin:0 0 4px; }
  .lp-h span { color:${GOLD}; }
  .lp-sub { text-align:center; font-size:13px; color:#a8998a; margin-bottom:16px; }
  .lp-offers { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px; }
  .lp-offer { position:relative; border:1.5px solid ${LINE}; border-radius:14px; padding:12px 8px;
    text-align:center; cursor:pointer; background:#000; color:#f3ece4; font-family:inherit; }
  .lp-offer.on { background:${GOLD}; border-color:${GOLD}; color:#1a120a; }
  .lp-offer b { display:block; font-size:24px; font-weight:900; margin-top:2px; }
  .lp-save { position:absolute; top:-10px; left:50%; transform:translateX(-50%); white-space:nowrap;
    background:#c0392b; color:#fff; font-size:10px; font-weight:800; padding:2px 8px; border-radius:20px; }
  .lp-lbl { font-size:13px; color:#a8998a; margin:12px 0 6px; font-weight:700; }
  .lp-chips { display:flex; gap:6px; flex-wrap:wrap; }
  .lp-chip { padding:8px 12px; border-radius:10px; border:1.5px solid ${LINE}; background:#000;
    color:#f3ece4; font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; min-width:44px; }
  .lp-chip.on { background:${GOLD}; border-color:${GOLD}; color:#1a120a; }
  .lp-pair { border-top:1px dashed ${LINE}; margin-top:12px; padding-top:4px; }
  .lp-in { width:100%; box-sizing:border-box; padding:13px 14px; margin-top:10px; border-radius:12px;
    border:1.5px solid ${LINE}; background:#000; color:#fff; font-family:inherit; font-size:15px;
    outline:none; direction:rtl; }
  .lp-in:focus { border-color:${GOLD}; }
  .lp-cta { width:100%; margin-top:16px; padding:16px; border:none; border-radius:14px; cursor:pointer;
    background:${GOLD}; color:#1a120a; font-family:inherit; font-size:18px; font-weight:900;
    animation: lpPulse 1.8s infinite; }
  .lp-cta:disabled { opacity:.6; animation:none; }
  .lp-err { margin-top:10px; color:#ff8a7a; font-size:13px; text-align:center; font-weight:700; }
  .lp-in.bad, .lp-chips.bad { border-color:#ff6b5a !important; box-shadow:0 0 0 2px rgba(255,107,90,.25); }
  .lp-chips.bad { border:1.5px solid #ff6b5a; border-radius:12px; padding:6px; }
  .lp-ferr { color:#ff8a7a; font-size:12.5px; font-weight:700; margin-top:5px; }
  .lp-trust { display:flex; justify-content:space-around; margin-top:14px; font-size:11px; color:#a8998a; text-align:center; }
  .lp-sticky { position:fixed; bottom:0; left:0; right:0; z-index:50; padding:10px 12px;
    background:linear-gradient(to top, #000 70%, rgba(0,0,0,0)); }
  .lp-sticky button { display:block; width:100%; max-width:536px; margin:0 auto; padding:15px;
    border:none; border-radius:14px; background:${GOLD}; color:#1a120a; font-family:'Tajawal',sans-serif;
    font-size:17px; font-weight:900; cursor:pointer; box-shadow:0 6px 24px rgba(200,162,122,.35); }
  @keyframes lpPulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.025) } }
  .lp-banner { position:sticky; top:0; z-index:60; overflow:hidden;
    display:flex; align-items:center; justify-content:center; gap:10px;
    background:linear-gradient(180deg,#1c140c 0%,#0b0805 100%); color:#f3ece4; text-align:center;
    padding:9px 10px; font-size:13.5px; font-weight:700; line-height:1.55;
    border-bottom:1px solid ${GOLD}; box-shadow:0 4px 18px rgba(0,0,0,.6); }
  .lp-banner::after { content:''; position:absolute; top:0; bottom:0; width:40%; left:-50%;
    background:linear-gradient(100deg,transparent,rgba(200,162,122,.16),transparent);
    animation:lpShine 3.8s ease-in-out infinite; pointer-events:none; }
  .lp-banner-txt { position:relative; z-index:1; }
  .lp-banner b { color:${GOLD}; font-weight:900; letter-spacing:.2px; }
  .lp-banner .lp-tag { color:${GOLD}; font-weight:900; font-size:14.5px; }
  .lp-banner s { color:#8f8173; font-weight:600; }
  .lp-flame { position:relative; z-index:1; display:inline-block; font-size:22px; line-height:1;
    transform-origin:50% 90%; filter:drop-shadow(0 0 6px rgba(255,140,40,.75));
    animation:lpFlicker 1.1s ease-in-out infinite alternate; }
  .lp-flame.r { animation-delay:-.55s; animation-duration:1.25s; }
  @keyframes lpFlicker {
    0%   { transform:scale(1)    rotate(-3deg); filter:drop-shadow(0 0 5px rgba(255,140,40,.6)) brightness(1); }
    25%  { transform:scale(1.12,1.18) rotate(2deg); filter:drop-shadow(0 0 10px rgba(255,170,60,.95)) brightness(1.15); }
    50%  { transform:scale(.95,1.05) rotate(-2deg); filter:drop-shadow(0 0 6px rgba(255,120,30,.7)) brightness(.95); }
    75%  { transform:scale(1.08,1.14) rotate(3deg); filter:drop-shadow(0 0 12px rgba(255,180,70,1)) brightness(1.2); }
    100% { transform:scale(1,1.08) rotate(-1deg); filter:drop-shadow(0 0 7px rgba(255,150,50,.8)) brightness(1.05); }
  }
  @keyframes lpShine { 0% { left:-50% } 60%,100% { left:120% } }
  @media (prefers-reduced-motion: reduce) { .lp-flame, .lp-banner::after { animation:none; } }
  .lp-old { display:block; font-size:12px; text-decoration:line-through; opacity:.6; font-weight:600; }
`

// ── TRACKING ──────────────────────────────────────────────────
const lpEvent = (lp, type, extra = {}) =>
  fetch('/api/lp/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ lp, type, ...extra })
  }).catch(() => {})

const ss = {
  get: k => { try { return sessionStorage.getItem(k) } catch { return null } },
  set: (k, v) => { try { sessionStorage.setItem(k, v) } catch {} }
}

export default function LandingStephano({ id }) {
  const lp = LP_PAGES[id] ? id : '01'
  const imgs = LP_PAGES[lp]

  const [offer,   setOffer]   = useState(0)
  const [pairs,   setPairs]   = useState([{ couleur: P.couleurs[0], taille: '' }, { couleur: P.couleurs[0], taille: '' }])
  const [form,    setForm]    = useState({ nom: '', tel: '', adresse: '', ville: '' })
  const [quartier, setQuartier] = useState('')
  const [error,   setError]   = useState('')
  const [errField, setErrField] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)
  const [showSticky, setShowSticky] = useState(true)
  const formRef = useRef(null)
  const t0 = useRef(Date.now())

  // visit (once per session per page) + landing time
  useEffect(() => {
    window.scrollTo(0, 0)
    const k = 'lp_t0_' + lp
    const saved = ss.get(k)
    if (saved) t0.current = parseInt(saved, 10)
    else {
      ss.set(k, String(t0.current))
      lpEvent(lp, 'visit')
    }
    fbPixel('ViewContent', { content_name: 'Stephano LP' + lp, value: 330, currency: 'MAD' })
  }, [lp])

  // form reached (once per session) + hide sticky button when form is visible
  useEffect(() => {
    const el = formRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => {
      setShowSticky(!e.isIntersecting)
      if (e.isIntersecting && !ss.get('lp_form_' + lp)) {
        ss.set('lp_form_' + lp, '1')
        lpEvent(lp, 'form')
      }
    }, { threshold: 0.15 })
    io.observe(el)
    return () => io.disconnect()
  }, [lp])

  // time spent on the page (only while visible), sent when leaving / hiding
  useEffect(() => {
    let start = document.visibilityState === 'visible' ? Date.now() : null
    const flush = () => {
      if (start === null) return
      const ms = Date.now() - start
      start = null
      if (ms < 500) return
      const first = !ss.get('lp_stay_' + lp)
      ss.set('lp_stay_' + lp, '1')
      const body = JSON.stringify({ lp, ms, first })
      try {
        if (navigator.sendBeacon) navigator.sendBeacon('/api/lp/stay', new Blob([body], { type: 'application/json' }))
        else fetch('/api/lp/stay', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body, keepalive: true })
      } catch {}
    }
    const onVis = () => {
      if (document.visibilityState === 'hidden') flush()
      else if (start === null) start = Date.now()
    }
    document.addEventListener('visibilitychange', onVis)
    window.addEventListener('pagehide', flush)
    return () => {
      flush()
      document.removeEventListener('visibilitychange', onVis)
      window.removeEventListener('pagehide', flush)
    }
  }, [lp])

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const setPair = (i, k, v) => setPairs(ps => ps.map((p, j) => j === i ? { ...p, [k]: v } : p))
  const goForm = () => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  const o = OFFERS[offer]
  const used = pairs.slice(0, o.qty)

  // show the error next to the field, scroll to it, and count it for the admin
  const fail = (field, msg) => {
    setError(msg); setErrField(field)
    lpFormError(lp, field)
    setTimeout(() => {
      const el = document.getElementById('lp-f-' + field)
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (el.focus && el.tagName !== 'DIV') el.focus() }
    }, 30)
  }
  const ferr = f => errField === f && error ? <div className="lp-ferr">⚠️ {error}</div> : null

  const submit = async () => {
    const tel = normalizePhone(form.tel)
    if (tel !== form.tel) setForm(f => ({ ...f, tel }))
    const noSize = used.findIndex(p => !p.taille)
    if (noSize !== -1)                   return fail('taille' + noSize, 'اختار المقاس')
    if (!form.nom.trim())                return fail('nom', 'دخل الاسم الكامل')
    if (!/^0[67]\d{8}$/.test(tel))       return fail('tel', 'رقم الهاتف خاصو يكون 06 ولا 07 + 8 أرقام')
    if (!form.ville.trim())              return fail('ville', 'كتب المدينة')
    if (isCasa(form.ville) && !quartier) return fail('quartier', 'اختار المقاطعة ديالك فكازا')
    if (!form.adresse.trim())            return fail('adresse', 'دخل العنوان')
    setError(''); setErrField(''); setLoading(true)
    try {
      // order reads cleanly: "Stéphano Noir 42" / "Stéphano Noir 42 + Stéphano Marron 43"
      // (admin / sheet / WhatsApp append couleur + taille after produit)
      const short = c => c === 'Gris ardoise' ? 'Gris' : c
      const last  = used[used.length - 1]
      const before = used.slice(0, -1).map(p => `${P.nom.fr} ${short(p.couleur)} ${p.taille} + `).join('')
      const ville = isCasa(form.ville) ? `Casablanca - ${quartier}` : form.ville.trim()
      const res = await createOrder({
        ...form, tel, ville,
        couleur: short(last.couleur),
        taille:  last.taille,
        produit: `${before}${P.nom.fr}`,
        prix: o.prix, langue: 'ar'
      })
      if (!res || !res.success) {
        lpFormError(lp, 'server_' + (res?.field || 'other'))
        if (res?.field) return fail(res.field, res.error || 'وقع مشكل، عاود من فضلك')
        setError(res?.error || 'وقع مشكل، عاود من فضلك'); return
      }
      const ms = Date.now() - t0.current
      if (!ss.get('lp_order_' + lp + '_' + res.ref)) {
        ss.set('lp_order_' + lp + '_' + res.ref, '1')
        lpEvent(lp, 'order', { ms, qty: o.qty, prix: o.prix, ref: res.ref })
      }
      fbPixel('Purchase', { value: o.prix, currency: 'MAD', content_name: 'Stephano LP' + lp, num_items: o.qty })
      setSuccess(res)
      setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50)
    } catch (e) {
      lpFormError(lp, 'network')
      setError('وقع مشكل، عاود من فضلك')
    } finally { setLoading(false) }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="lp">
        <div className="lp-wrap">

          <div className="lp-banner">
            <span className="lp-flame" aria-hidden="true">🔥</span>
            <span className="lp-banner-txt">
              <span className="lp-tag">عرض محدود</span> ابتداءً من اليوم {todayStr()}
              <br />
              حذاء واحد بـ<b>330 درهم</b> بدل <s>490</s> · جوج أحذية بـ<b>590 درهم</b>
            </span>
            <span className="lp-flame r" aria-hidden="true">🔥</span>
          </div>

          {imgs.map(([w, h], i) => (
            <img key={i} className="lp-img"
              src={`/products/stephano/lp/${lp}/${i + 1}.jpg`}
              width={w} height={h}
              alt={`Stéphano ${i + 1}`}
              loading={i < 2 ? 'eager' : 'lazy'}
              fetchpriority={i === 0 ? 'high' : 'auto'}
              decoding="async" />
          ))}

          <div className="lp-form" ref={formRef}>
            <div className="lp-box">
              {success ? (
                <div style={{ textAlign: 'center', padding: '18px 0' }}>
                  <div style={{ fontSize: 46 }}>✅</div>
                  <div className="lp-h">شكراً! <span>الطلب ديالك توصلنا</span></div>
                  <div className="lp-sub" style={{ marginTop: 8 }}>
                    غادي نتاصلو بيك فأقرب وقت باش نأكدو الطلب
                  </div>
                  <div style={{ fontSize: 13, color: GOLD, fontWeight: 800 }}>رقم الطلب: {success.ref}</div>
                </div>
              ) : (
                <>
                  <div className="lp-h">اطلب <span>ستيفانو</span> دابا</div>
                  <div className="lp-sub">الدفع عند الاستلام · التوصيل لجميع المدن</div>

                  <div className="lp-offers">
                    {OFFERS.map((of, i) => (
                      <button key={i} className={'lp-offer' + (offer === i ? ' on' : '')} onClick={() => setOffer(i)}>
                        {of.save && <span className="lp-save">{of.save}</span>}
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{of.label}</span>
                        <b>{of.prix} درهم</b>
                        <span className="lp-old">{of.old} درهم</span>
                      </button>
                    ))}
                  </div>

                  {used.map((p, i) => (
                    <div key={i} className={i > 0 ? 'lp-pair' : ''}>
                      {o.qty > 1 && <div className="lp-lbl" style={{ color: GOLD }}>الحذاء {i === 0 ? 'الأول' : 'الثاني'}</div>}
                      <div className="lp-lbl">اللون</div>
                      <div className="lp-chips">
                        {P.couleurs.map(c => (
                          <button key={c} className={'lp-chip' + (p.couleur === c ? ' on' : '')}
                            onClick={() => setPair(i, 'couleur', c)}>{COLOR_AR[c] || c}</button>
                        ))}
                      </div>
                      <div className="lp-lbl">المقاس</div>
                      <div id={'lp-f-taille' + i} className={'lp-chips' + (errField === 'taille' + i ? ' bad' : '')}>
                        {P.tailles.map(t => (
                          <button key={t} className={'lp-chip' + (p.taille === String(t) ? ' on' : '')}
                            onClick={() => { setPair(i, 'taille', String(t)); if (errField === 'taille' + i) { setErrField(''); setError('') } }}>{t}</button>
                        ))}
                      </div>
                      {ferr('taille' + i)}
                    </div>
                  ))}

                  <input id="lp-f-nom" className={'lp-in' + (errField === 'nom' ? ' bad' : '')} placeholder="الاسم الكامل"
                    value={form.nom} onChange={set('nom')} autoComplete="name" />
                  {ferr('nom')}
                  <input id="lp-f-tel" className={'lp-in' + (errField === 'tel' ? ' bad' : '')} placeholder="رقم الهاتف (06 / 07)"
                    inputMode="tel" type="tel" autoComplete="tel" maxLength={20}
                    value={form.tel} onChange={set('tel')}
                    onBlur={() => setForm(f => ({ ...f, tel: normalizePhone(f.tel) }))} />
                  {ferr('tel')}
                  <input id="lp-f-ville" className={'lp-in' + (errField === 'ville' ? ' bad' : '')} placeholder="المدينة" value={form.ville}
                    onChange={e => { set('ville')(e); if (!isCasa(e.target.value)) setQuartier('') }} />
                  {ferr('ville')}
                  {isCasa(form.ville) && (
                    <select id="lp-f-quartier" className={'lp-in' + (errField === 'quartier' ? ' bad' : '')} value={quartier} onChange={e => setQuartier(e.target.value)}
                      style={{ borderColor: quartier ? LINE : GOLD }}>
                      <option value="">— اختار المقاطعة —</option>
                      {CASA_QUARTIERS.map(q => <option key={q} value={q}>{q}</option>)}
                      <option value="Autre">حي آخر</option>
                    </select>
                  )}
                  {isCasa(form.ville) && ferr('quartier')}
                  <input id="lp-f-adresse" className={'lp-in' + (errField === 'adresse' ? ' bad' : '')} placeholder="العنوان"
                    value={form.adresse} onChange={set('adresse')} autoComplete="street-address" />
                  {ferr('adresse')}

                  <button className="lp-cta" onClick={submit} disabled={loading}>
                    {loading ? '...' : `أكد الطلب — ${o.prix} درهم`}
                  </button>
                  {error && !errField && <div className="lp-err">{error}</div>}

                  <div className="lp-trust">
                    <span>🚚<br/>توصيل سريع</span>
                    <span>💵<br/>الدفع عند الاستلام</span>
                    <span>🔁<br/>تبديل المقاس</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {showSticky && !success && (
          <div className="lp-sticky">
            <button onClick={goForm}>اطلب دابا — {o.prix} درهم</button>
          </div>
        )}
      </div>
    </>
  )
}
