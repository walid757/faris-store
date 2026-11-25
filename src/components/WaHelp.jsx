import React, { useState, useEffect, useRef } from 'react'

// ── WHATSAPP BUTTON + "need help?" card for landing pages ─────
// - floating green WhatsApp button (above the sticky order bar)
// - help card shows once: 25s after the visitor starts the form without ordering,
//   or right away after 2 form errors (pages dispatch 'faris:formerror')
export const WA_NUMBER = '212710827264'
const HELP_DELAY = 25000

const TXT = {
  ar: {
    dir: 'rtl',
    btn: 'تواصل معنا',
    online: 'متاح الآن',
    title: 'عندك مشكل فالطلب؟',
    sub: 'تواصل معنا فواتساب ونساعدوك تكمل الطلب ديالك فدقيقة',
    cta: 'تواصل معنا على واتساب',
    msg: p => `السلام عليكم، بغيت نسول على ${p}`,
    help: p => `السلام عليكم، بغيت نطلب ${p} وعندي مشكل فالفورمولير`
  },
  fr: {
    dir: 'ltr',
    btn: 'Contactez-nous',
    online: 'En ligne',
    title: 'Un souci avec la commande ?',
    sub: 'Écrivez-nous sur WhatsApp, on vous aide à finaliser en 1 minute',
    cta: 'Contactez-nous sur WhatsApp',
    msg: p => `Bonjour, je voudrais des informations sur ${p}`,
    help: p => `Bonjour, je veux commander ${p} mais j'ai un problème avec le formulaire`
  }
}

const CSS = `
  @keyframes wah-pulse { 0%{box-shadow:0 0 0 0 rgba(37,211,102,.55)} 70%{box-shadow:0 0 0 14px rgba(37,211,102,0)} 100%{box-shadow:0 0 0 0 rgba(37,211,102,0)} }
  @keyframes wah-dot { 0%,100%{opacity:1} 50%{opacity:.3} }
  @keyframes wah-up { from{transform:translateY(24px);opacity:0} to{transform:translateY(0);opacity:1} }
  .wah-btn { position:fixed; left:14px; bottom:86px; z-index:160; display:flex; align-items:center; gap:8px;
    background:#25d366; color:#fff; text-decoration:none; border-radius:50px; padding:8px 14px 8px 8px;
    box-shadow:0 6px 20px rgba(0,0,0,.25); animation:wah-pulse 2s infinite; font-family:Tajawal,Inter,sans-serif;
    transition:transform .2s ease; }
  .wah-btn:hover { transform:translateY(-3px); }
  .wah-ic { width:34px; height:34px; border-radius:50%; background:rgba(255,255,255,.18); display:flex; align-items:center; justify-content:center; }
  .wah-t1 { font-size:9px; font-weight:700; opacity:.9; display:flex; align-items:center; gap:4px; }
  .wah-t1 i { width:6px; height:6px; border-radius:50%; background:#fff; display:inline-block; animation:wah-dot 1.5s infinite; }
  .wah-t2 { font-size:13px; font-weight:800; white-space:nowrap; }
  .wah-card { position:fixed; left:12px; right:12px; bottom:150px; z-index:170; max-width:380px; margin:0 auto;
    background:#fff; border-radius:18px; padding:20px 18px 16px; box-shadow:0 18px 50px rgba(0,0,0,.35);
    animation:wah-up .35s ease; font-family:Tajawal,Inter,sans-serif; text-align:center; border-top:4px solid #25d366; }
  .wah-x { position:absolute; top:10px; width:28px; height:28px; border-radius:50%; border:none; background:#f1f1f1; color:#555; font-size:13px; cursor:pointer; }
  .wah-card h4 { margin:4px 0 6px; font-size:17px; font-weight:900; color:#111; }
  .wah-card p { margin:0 0 14px; font-size:13.5px; color:#555; line-height:1.6; }
  .wah-go { display:flex; align-items:center; justify-content:center; gap:9px; background:#25d366; color:#fff; text-decoration:none;
    padding:13px 16px; border-radius:12px; font-weight:800; font-size:15px; box-shadow:0 4px 16px rgba(37,211,102,.4); }
  .wah-num { margin-top:9px; font-size:12px; color:#888; direction:ltr; }
`

const Icon = ({ size = 22 }) => (
  <svg viewBox="0 0 32 32" width={size} height={size} fill="white" aria-hidden="true">
    <path d="M16 2C8.27 2 2 8.27 2 16c0 2.44.65 4.73 1.79 6.72L2 30l7.5-1.96A13.93 13.93 0 0016 30c7.73 0 14-6.27 14-14S23.73 2 16 2zm0 25.5c-2.22 0-4.3-.6-6.1-1.64l-.44-.26-4.45 1.16 1.19-4.33-.29-.46A11.47 11.47 0 014.5 16C4.5 9.6 9.6 4.5 16 4.5S27.5 9.6 27.5 16 22.4 27.5 16 27.5zm6.3-8.56c-.34-.17-2.02-1-2.34-1.11-.32-.11-.55-.17-.78.17s-.9 1.11-1.1 1.34c-.2.23-.4.26-.74.09-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.23-.34.34-.57.11-.23.06-.43-.03-.6-.09-.17-.78-1.88-1.07-2.57-.28-.67-.57-.58-.78-.59h-.67c-.23 0-.6.09-.91.43-.32.34-1.21 1.18-1.21 2.88s1.24 3.34 1.41 3.57c.17.23 2.44 3.73 5.91 5.23.83.36 1.47.57 1.97.73.83.26 1.58.23 2.17.14.66-.1 2.02-.83 2.31-1.62.28-.8.28-1.48.2-1.62-.09-.14-.32-.23-.66-.4z"/>
  </svg>
)

const track = (page, type) => {
  try {
    fetch('/api/wa/click', { method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ page, type }), keepalive: true }).catch(() => {})
  } catch {}
}

export default function WaHelp({ lang = 'ar', product = 'Faris', page = 'home', done = false }) {
  const T = TXT[lang] || TXT.ar
  const [show, setShow] = useState(false)
  const shown = useRef(false)
  const timer = useRef(null)
  const errs  = useRef(0)
  const doneRef = useRef(done)
  doneRef.current = done

  const open = () => {
    if (shown.current || doneRef.current) return
    shown.current = true
    setShow(true)
    track(page, 'helpShown')
  }

  useEffect(() => {
    // start the 25s timer the first time the visitor touches a form field
    const onFocus = e => {
      const tag = e.target && e.target.tagName
      if (!['INPUT', 'SELECT', 'TEXTAREA'].includes(tag)) return
      if (timer.current || shown.current) return
      timer.current = setTimeout(open, HELP_DELAY)
    }
    const onErr = () => { errs.current++; if (errs.current >= 2) open() }
    document.addEventListener('focusin', onFocus)
    window.addEventListener('faris:formerror', onErr)
    return () => {
      document.removeEventListener('focusin', onFocus)
      window.removeEventListener('faris:formerror', onErr)
      clearTimeout(timer.current)
    }
  }, [page])

  useEffect(() => { if (done) { clearTimeout(timer.current); setShow(false) } }, [done])

  const link = text => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`

  return (
    <>
      <style>{CSS}</style>
      {show && !done && (
        <div className="wah-card" dir={T.dir} role="dialog">
          <button className="wah-x" style={T.dir === 'rtl' ? { left: 10 } : { right: 10 }}
            onClick={() => setShow(false)} aria-label="close">✕</button>
          <div style={{ fontSize: 34 }}>🤝</div>
          <h4>{T.title}</h4>
          <p>{T.sub}</p>
          <a className="wah-go" href={link(T.help(product))} target="_blank" rel="noopener noreferrer"
            onClick={() => { track(page, 'help'); setShow(false) }}>
            <Icon /> {T.cta}
          </a>
          <div className="wah-num">+212 710 827 264</div>
        </div>
      )}
      <a className="wah-btn" href={link(T.msg(product))} target="_blank" rel="noopener noreferrer"
        onClick={() => track(page, 'button')} aria-label="WhatsApp">
        <span className="wah-ic"><Icon size={20} /></span>
        <span dir={T.dir}>
          <span className="wah-t1"><i />{T.online}</span>
          <span className="wah-t2">{T.btn}</span>
        </span>
      </a>
    </>
  )
}
