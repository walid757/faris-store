import React, { useState, useEffect, useRef } from 'react'
import { createOrder, fbPixel, ttPixel } from '../api/client.js'
import WaHelp from '../components/WaHelp.jsx'
import { M26_DIMS } from '../data/m26dims.js'

// ── MODELS 26-11 LANDING PAGES (A/B test, 4 pages per model) ──
// One link per model: #gs101 .. #gs107 · #gs0441  (rotates its 4 pages)
// Page links: #m26/<model>/<DA1|DA2|FU1|FU2>   (DA = Darija, FU = Fousha)
// Images: public/products/m26/<model>/<page>/<n>.jpg · form in Arabic

// colors = [value saved in the order, label shown on the page]
export const M26_MODELS = {
  gs101:  { name: 'GS101',  colors: [['Noir', 'كحل'], ['Marron', 'بني']] },
  gs102:  { name: 'GS102',  colors: [['Blanc', 'بيض']] },
  gs103:  { name: 'GS103',  colors: [['Blanc', 'بيض'], ['Bleu marine', 'كحلي'], ['Marron', 'بني']] },
  gs104:  { name: 'GS104',  colors: [['Bleu', 'زرق']] },
  gs105:  { name: 'GS105',  colors: [['Noir', 'كحل']] },
  gs106:  { name: 'GS106',  colors: [['Noir', 'كحل']] },
  gs107:  { name: 'GS107',  colors: [['Noir', 'كحل']] },
  gs0441: { name: 'GS0441', colors: [['Noir', 'كحل']] }
}
export const M26_IDS = Object.keys(M26_MODELS)
export const M26_PAGE_IDS = ['DA1', 'DA2', 'FU1', 'FU2']
export const M26_CAMPAIGN = m => 'm26-' + m

const SIZES  = [39, 40, 41, 42, 43, 44]
const OFFERS = [{ qty: 1, prix: 420 }, { qty: 2, prix: 670 }]

const T = {
  dir: 'rtl',
  one: 'حذاء واحد', two: 'جوج أحذية', cur: 'درهم',
  save: 'وفر 170 درهم',
  sub: 'الدفع عند الاستلام · التوصيل لجميع المدن',
  color: 'اللون', size: 'المقاس', shoe: i => 'الحذاء ' + (i === 0 ? 'الأول' : 'الثاني'),
  nom: 'الاسم الكامل', tel: 'رقم الهاتف (06 / 07)', ville: 'المدينة', adresse: 'العنوان',
  quartier: '— اختار المقاطعة —', other: 'حي آخر',
  cta: p => `أكد الطلب — ${p} درهم`, sticky: p => `اطلب دابا — ${p} درهم`,
  trust: ['🚚', 'توصيل سريع', '💵', 'الدفع عند الاستلام', '🔁', 'تبديل المقاس'],
  eSize: 'اختار المقاس', eNom: 'دخل الاسم الكامل', eTel: 'رقم الهاتف خاصو يكون 06 ولا 07 + 8 أرقام',
  eVille: 'كتب المدينة', eQuartier: 'اختار المقاطعة ديالك فكازا', eAdresse: 'دخل العنوان',
  eGen: 'وقع مشكل، عاود من فضلك',
  okSub: 'غادي نتاصلو بيك فأقرب وقت باش نأكدو الطلب', okRef: 'رقم الطلب:',
  ticker: ['🚚 التوصيل مجاني', '💵 الدفع عند الاستلام', '📦 حل الكولي وقلّب قبل ما تخلص']
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
  .m26 { background:${BG}; min-height:100vh; font-family:'Tajawal',sans-serif; color:#f3ece4; }
  .m26-wrap { max-width:560px; margin:0 auto; background:${BG}; }
  .m26-img { display:block; width:100%; height:auto; background:#111; }
  .m26-form { padding:22px 16px 110px; }
  .m26-box { background:${CARD}; border:1px solid ${LINE}; border-radius:18px; padding:18px 16px; }
  .m26-h { text-align:center; font-size:22px; font-weight:900; margin:0 0 4px; }
  .m26-h span { color:${GOLD}; }
  .m26-sub { text-align:center; font-size:13px; color:#a8998a; margin-bottom:16px; }
  .m26-offers { display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:16px; }
  .m26-offer { position:relative; border:1.5px solid ${LINE}; border-radius:14px; padding:12px 8px;
    text-align:center; cursor:pointer; background:#000; color:#f3ece4; font-family:inherit; }
  .m26-offer.on { background:${GOLD}; border-color:${GOLD}; color:#1a120a; }
  .m26-offer b { display:block; font-size:24px; font-weight:900; margin-top:2px; }
  .m26-save { position:absolute; top:-10px; left:50%; transform:translateX(-50%); white-space:nowrap;
    background:#c0392b; color:#fff; font-size:10px; font-weight:800; padding:2px 8px; border-radius:20px; }
  .m26-lbl { font-size:13px; color:#a8998a; margin:12px 0 6px; font-weight:700; }
  .m26-chips { display:flex; gap:6px; flex-wrap:wrap; }
  .m26-chip { padding:8px 12px; border-radius:10px; border:1.5px solid ${LINE}; background:#000;
    color:#f3ece4; font-family:inherit; font-size:13px; font-weight:700; cursor:pointer; min-width:44px; }
  .m26-chip.on { background:${GOLD}; border-color:${GOLD}; color:#1a120a; }
  .m26-pair { border-top:1px dashed ${LINE}; margin-top:12px; padding-top:4px; }
  .m26-in { width:100%; box-sizing:border-box; padding:13px 14px; margin-top:10px; border-radius:12px;
    border:1.5px solid ${LINE}; background:#000; color:#fff; font-family:inherit; font-size:15px; outline:none; }
  .m26-in:focus { border-color:${GOLD}; }
  .m26-in.bad { border-color:#ff6b5a !important; box-shadow:0 0 0 2px rgba(255,107,90,.25); }
  .m26-chips.bad { border:1.5px solid #ff6b5a; border-radius:12px; padding:6px; }
  .m26-ferr { color:#ff8a7a; font-size:12.5px; font-weight:700; margin-top:5px; }
  .m26-cta { width:100%; margin-top:16px; padding:16px; border:none; border-radius:14px; cursor:pointer;
    background:${GOLD}; color:#1a120a; font-family:inherit; font-size:18px; font-weight:900; animation:m26Pulse 1.8s infinite; }
  .m26-cta:disabled { opacity:.6; animation:none; }
  .m26-err { margin-top:10px; color:#ff8a7a; font-size:13px; text-align:center; font-weight:700; }
  .m26-trust { display:flex; justify-content:space-around; margin-top:14px; font-size:11px; color:#a8998a; text-align:center; }
  .m26-sticky { position:fixed; bottom:0; left:0; right:0; z-index:50; padding:10px 12px;
    background:linear-gradient(to top, #000 70%, rgba(0,0,0,0)); }
  .m26-sticky button { display:block; width:100%; max-width:536px; margin:0 auto; padding:15px; border:none; border-radius:14px;
    background:${GOLD}; color:#1a120a; font-family:'Tajawal',sans-serif; font-size:17px; font-weight:900; cursor:pointer;
    box-shadow:0 6px 24px rgba(200,162,122,.35); }
  @keyframes m26Pulse { 0%,100% { transform:scale(1) } 50% { transform:scale(1.025) } }
  .m26-ticker { position:sticky; top:0; z-index:60; overflow:hidden; white-space:nowrap;
    background:${GOLD}; color:#1a120a; border-bottom:1px solid #8e6f4d; box-shadow:0 4px 14px rgba(0,0,0,.5); }
  .m26-ticker .m26-track { display:inline-flex; gap:38px; padding:10px 0; font-weight:800; font-size:14px;
    animation:m26Tick 16s linear infinite; }
  .m26-ticker .m26-track span { display:inline-flex; align-items:center; gap:6px; }
  @keyframes m26Tick { from { transform:translateX(0) } to { transform:translateX(50%) } }
  @media (prefers-reduced-motion: reduce) { .m26-ticker .m26-track, .m26-cta { animation:none; } }
`

export default function LandingM26({ model, id }) {
  const m      = M26_MODELS[model] ? model : M26_IDS[0]
  const NAME   = M26_MODELS[m].name
  const COLORS = M26_MODELS[m].colors
  const c      = M26_CAMPAIGN(m)
  const dims   = M26_DIMS[m]
  const lp     = dims[id] ? id : M26_PAGE_IDS[0]
  const imgs   = dims[lp]
  const key    = c + '_' + lp
  const imgBase = `/products/m26/${m}/${lp}/`
  const pxName  = `${NAME} ${lp}`

  const [offer,    setOffer]    = useState(0)
  const [pairs,    setPairs]    = useState([{ couleur: COLORS[0][0], taille: '' }, { couleur: COLORS[0][0], taille: '' }])
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
    ttPixel('ViewContent', { content_id: NAME, content_type: 'product', content_name: pxName, value: OFFERS[0].prix, currency: 'MAD' })
  }, [key])

  // form reached + hide sticky button while the form is visible
  useEffect(() => {
    const el = formRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => {
      setShowSticky(!e.isIntersecting)
      if (e.isIntersecting && !ss.get('lp2_form_' + key)) {
        ss.set('lp2_form_' + key, '1'); post('/api/lp2/event', { c, lp, type: 'form' })
        fbPixel('InitiateCheckout', { content_name: pxName, value: OFFERS[0].prix, currency: 'MAD' })
        ttPixel('InitiateCheckout', { content_id: NAME, content_type: 'product', content_name: pxName, value: OFFERS[0].prix, currency: 'MAD' })
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
    try { window.dispatchEvent(new Event('faris:formerror')) } catch {}
    setError(msg); setErrField(field)
    post('/api/lp2/formerror', { c, lp, field })
    setTimeout(() => {
      const el = document.getElementById('m26-f-' + field)
      if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); if (el.focus && el.tagName !== 'DIV') el.focus() }
    }, 30)
  }
  const ferr = f => errField === f && error ? <div className="m26-ferr">⚠️ {error}</div> : null

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
      // clean order: "GS101 Noir 42" / "GS101 Noir 42 + GS101 Marron 43"
      const last   = used[used.length - 1]
      const before = used.slice(0, -1).map(p => `${NAME} ${p.couleur} ${p.taille} + `).join('')
      const ville  = isCasa(form.ville) ? `Casablanca - ${quartier}` : form.ville.trim()
      const res = await createOrder({
        ...form, tel, ville,
        couleur: last.couleur,
        taille:  last.taille,
        produit: `${before}${NAME}`,
        prix: o.prix, langue: 'ar'
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
      const ttOrder = { content_id: NAME, content_type: 'product', content_name: pxName, quantity: o.qty, value: o.prix, currency: 'MAD' }
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
      <div className="m26" dir={T.dir}>
        <div className="m26-wrap">

          {/* ticker banner: free delivery · pay on delivery · open the parcel */}
          <div className="m26-ticker" aria-label={T.ticker.join(' · ')}>
            <div className="m26-track" aria-hidden="true">
              {[0, 1, 2, 3].flatMap(k => T.ticker.map((t, i) => <span key={k + '-' + i}>{t}</span>))}
            </div>
          </div>

          {imgs.map(([w, h], i) => (
            <img key={i} className="m26-img" src={`${imgBase}${i + 1}.jpg`}
              width={w} height={h} alt={`${NAME} ${i + 1}`}
              loading={i < 2 ? 'eager' : 'lazy'} fetchpriority={i === 0 ? 'high' : 'auto'} decoding="async" />
          ))}

          <div className="m26-form" ref={formRef}>
            <div className="m26-box">
              {success ? (
                <div style={{ textAlign: 'center', padding: '18px 0' }}>
                  <div style={{ fontSize: 46 }}>✅</div>
                  <div className="m26-h">شكراً! <span>الطلب ديالك توصلنا</span></div>
                  <div className="m26-sub" style={{ marginTop: 8 }}>{T.okSub}</div>
                  <div style={{ fontSize: 13, color: GOLD, fontWeight: 800 }}>{T.okRef} {success.ref}</div>
                </div>
              ) : (
                <>
                  <div className="m26-h">اطلب <span>{NAME}</span> دابا</div>
                  <div className="m26-sub">{T.sub}</div>

                  <div className="m26-offers">
                    {OFFERS.map((of, i) => (
                      <button key={i} className={'m26-offer' + (offer === i ? ' on' : '')} onClick={() => setOffer(i)}>
                        {i === 1 && <span className="m26-save">{T.save}</span>}
                        <span style={{ fontSize: 13, fontWeight: 700 }}>{i === 0 ? T.one : T.two}</span>
                        <b>{of.prix} {T.cur}</b>
                      </button>
                    ))}
                  </div>

                  {used.map((p, i) => (
                    <div key={i} className={i > 0 ? 'm26-pair' : ''}>
                      {o.qty > 1 && <div className="m26-lbl" style={{ color: GOLD }}>{T.shoe(i)}</div>}
                      <div className="m26-lbl">{T.color}</div>
                      <div className="m26-chips">
                        {COLORS.map(([val, label]) => (
                          <button key={val} className={'m26-chip' + (p.couleur === val ? ' on' : '')}
                            onClick={() => setPair(i, 'couleur', val)}>{label}</button>
                        ))}
                      </div>
                      <div className="m26-lbl">{T.size}</div>
                      <div id={'m26-f-taille' + i} className={'m26-chips' + (errField === 'taille' + i ? ' bad' : '')}>
                        {SIZES.map(t => (
                          <button key={t} className={'m26-chip' + (p.taille === String(t) ? ' on' : '')}
                            onClick={() => { setPair(i, 'taille', String(t)); if (errField === 'taille' + i) { setErrField(''); setError('') } }}>{t}</button>
                        ))}
                      </div>
                      {ferr('taille' + i)}
                    </div>
                  ))}

                  <input id="m26-f-nom" className={'m26-in' + (errField === 'nom' ? ' bad' : '')} placeholder={T.nom}
                    value={form.nom} onChange={set('nom')} autoComplete="name" />
                  {ferr('nom')}
                  <input id="m26-f-tel" className={'m26-in' + (errField === 'tel' ? ' bad' : '')} placeholder={T.tel}
                    inputMode="tel" type="tel" autoComplete="tel" maxLength={20}
                    value={form.tel} onChange={set('tel')} onBlur={() => setForm(f => ({ ...f, tel: normalizePhone(f.tel) }))} />
                  {ferr('tel')}
                  <input id="m26-f-ville" className={'m26-in' + (errField === 'ville' ? ' bad' : '')} placeholder={T.ville}
                    value={form.ville} onChange={e => { set('ville')(e); if (!isCasa(e.target.value)) setQuartier('') }} />
                  {ferr('ville')}
                  {isCasa(form.ville) && (
                    <select id="m26-f-quartier" className={'m26-in' + (errField === 'quartier' ? ' bad' : '')} value={quartier}
                      onChange={e => setQuartier(e.target.value)} style={{ borderColor: quartier ? LINE : GOLD }}>
                      <option value="">{T.quartier}</option>
                      {CASA_QUARTIERS.map(q => <option key={q} value={q}>{q}</option>)}
                      <option value="Autre">{T.other}</option>
                    </select>
                  )}
                  {isCasa(form.ville) && ferr('quartier')}
                  <input id="m26-f-adresse" className={'m26-in' + (errField === 'adresse' ? ' bad' : '')} placeholder={T.adresse}
                    value={form.adresse} onChange={set('adresse')} autoComplete="street-address" />
                  {ferr('adresse')}

                  <button className="m26-cta" onClick={submit} disabled={loading}>{loading ? '...' : T.cta(o.prix)}</button>
                  {error && !errField && <div className="m26-err">{error}</div>}

                  <div className="m26-trust">
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
          <div className="m26-sticky"><button onClick={goForm}>{T.sticky(o.prix)}</button></div>
        )}
      </div>
      <WaHelp lang="ar" product={NAME} page={c + '/' + lp} done={!!success} />
    </>
  )
}
