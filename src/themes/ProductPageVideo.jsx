import React, { useState } from 'react'
import { PRODUCTS } from '../data/products.js'
import { createOrder } from '../api/client.js'

const DARK  = '#1a0d06'
const MID   = '#2C1A0E'
const BRAND = '#A0714F'
const GOLD  = '#C9A077'
const CREAM = '#fdf6ef'
const RED   = '#e53935'

// How Leather Is Still Made Using an Ancient Method in Morocco — YouTube
const VIDEO_ID = 'LzYDnlQvem0'

const CITIES = [
  'الدار البيضاء','الرباط','فاس','مراكش','أكادير','طنجة','مكناس','وجدة',
  'القنيطرة','تطوان','الجديدة','سطات','بني ملال','خريبكة','الناظور','أخرى'
]

const REVIEWS = [
  { name:'أحمد الراشدي', city:'الرباط', stars:5,
    text:'أفضل حذاء اشتريته في حياتي. الجلد ناعم، الخياطة محكمة، والتوصيل وصل في 24 ساعة. الثمن يستاهل بكل تأكيد.' },
  { name:'خالد الزهراني', city:'مراكش', stars:5,
    text:'كنت متردداً في البداية لكن بعد ما وصل المنتج ما خيّبني. جلد طبيعي حقيقي وريحته تبان على المادة. شكراً فارس!' },
  { name:'يوسف المرابط', city:'فاس', stars:5,
    text:'أقتني منهم للمرة الثالثة. كل مرة نفس الجودة العالية. التغليف أنيق والحذاء يليق في أي مناسبة.' },
]

const CSS = `
  .ppv-page { background:#fff; min-height:100vh; direction:rtl; font-family:Tajawal,Cairo,sans-serif; color:#1a1a1a; }

  .ppv-hero-wrap {
    position: relative; overflow: hidden;
    background: ${DARK};
    min-height: 55vh;
    display: flex; align-items: center;
  }
  .ppv-hero-bg {
    position: absolute; inset: 0;
    background-size: cover; background-position: center;
    opacity: 0.35;
  }
  .ppv-hero-inner {
    position: relative; z-index:2;
    width: 100%; max-width: 1060px;
    margin: 0 auto; padding: 48px 16px;
    display: grid; grid-template-columns: 1fr 1fr; gap:40px; align-items:center;
  }

  .ppv-gallery { display:flex; flex-direction:column; gap:10px; }
  .ppv-main-img { border-radius:16px; overflow:hidden; border:2px solid rgba(201,160,119,.3); }
  .ppv-main-img img { width:100%; aspect-ratio:1; object-fit:cover; display:block; }
  .ppv-thumbs { display:flex; gap:8px; }
  .ppv-thumb {
    width:64px; height:64px; border-radius:10px; overflow:hidden;
    cursor:pointer; border:2px solid transparent; transition:border-color 0.2s; flex-shrink:0;
  }
  .ppv-thumb.active { border-color:${GOLD}; }
  .ppv-thumb img { width:100%; height:100%; object-fit:cover; }

  .ppv-info { color:white; }

  .ppv-section { max-width:1060px; margin:0 auto; padding:0 16px; }

  /* Video section */
  .ppv-video-wrap {
    background: ${DARK}; color:white;
    padding: 56px 16px; text-align:center;
  }
  .ppv-video-frame {
    position:relative; width:100%; max-width:760px; margin:0 auto;
    aspect-ratio: 16/9; border-radius:16px; overflow:hidden;
    border:2px solid rgba(201,160,119,.25);
  }
  .ppv-video-frame iframe { width:100%; height:100%; border:0; }

  /* Reviews */
  .ppv-reviews { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
  .ppv-review {
    background:${CREAM}; border-radius:14px; padding:20px;
    border:1px solid #f0e8df;
  }

  /* Order section */
  .ppv-order-section {
    background: ${CREAM}; padding:56px 16px;
  }
  .ppv-order-inner {
    max-width:760px; margin:0 auto;
    background:white; border-radius:20px;
    padding:36px; border:1px solid #e8d8c8;
    box-shadow:0 8px 40px rgba(160,113,79,.1);
  }

  .ppv-input {
    width:100%; padding:12px 14px;
    border:1.5px solid #e0d4c8; border-radius:10px;
    font-family:Tajawal,sans-serif; font-size:14px; color:${MID};
    background:#fdfaf7; box-sizing:border-box;
    outline:none; transition:border-color 0.2s; direction:rtl;
  }
  .ppv-input:focus { border-color:${BRAND}; background:white; }

  @media (max-width: 768px) {
    .ppv-hero-inner { grid-template-columns:1fr; gap:20px; min-height:auto; }
    .ppv-reviews { grid-template-columns:1fr; }
    .ppv-hero-wrap { min-height:auto; }
  }
`

export default function ProductPageVideo({ slug, lang, onLangToggle, onBack, onProduct }) {
  const product = PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0]
  const related  = PRODUCTS.filter(p => p.slug !== slug).slice(0, 4)

  const [img,    setImg]    = useState(0)
  const [form,   setForm]   = useState({
    nom:'', tel:'', adresse:'', ville:'',
    couleur: product.couleurs?.[0] || '',
    taille: ''
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.nom.trim())              return setError('يرجى إدخال الاسم الكامل')
    if (!/^0[67]\d{8}$/.test(form.tel)) return setError('رقم الهاتف غير صحيح (06XXXXXXXX)')
    if (!form.adresse.trim())          return setError('يرجى إدخال العنوان بالتفصيل')
    if (!form.ville)                   return setError('يرجى اختيار المدينة')
    setError(''); setLoading(true)
    try {
      const res = await createOrder({ ...form, produit: product.nom.ar, prix: product.prix, langue: 'ar' })
      setSuccess(res)
    } catch (e) {
      setError(e.message || 'حدث خطأ، يرجى المحاولة مجدداً')
    } finally { setLoading(false) }
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="ppv-page">

        {/* ── Header ── */}
        <header style={{ background:DARK, padding:'12px 20px',
          position:'sticky', top:0, zIndex:100,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          borderBottom:`1px solid rgba(201,160,119,.2)` }}>
          <button onClick={onBack}
            style={{ background:'none', border:`1px solid rgba(201,160,119,.4)`, borderRadius:8,
              cursor:'pointer', padding:'6px 14px', color:GOLD, fontSize:13, fontWeight:600,
              fontFamily:'Tajawal,sans-serif' }}>
            ← المتجر
          </button>
          <span style={{ fontFamily:'Pinyon Script,cursive', fontSize:32, color:GOLD }}>Faris</span>
          <button onClick={onLangToggle}
            style={{ background:'none', border:`1px solid rgba(201,160,119,.4)`, borderRadius:6,
              padding:'4px 10px', fontSize:12, cursor:'pointer', color:GOLD }}>
            FR
          </button>
        </header>

        {/* ── Hero ── */}
        <div className="ppv-hero-wrap">
          <div className="ppv-hero-bg" style={{ backgroundImage:`url(${product.imgs[0]})` }} />
          <div className="ppv-hero-inner">

            {/* Image gallery */}
            <div className="ppv-gallery">
              <div className="ppv-main-img">
                <img src={product.imgs[img]} alt={product.nom.ar} />
              </div>
              {product.imgs.length > 1 && (
                <div className="ppv-thumbs">
                  {product.imgs.map((src, i) => (
                    <div key={i} className={`ppv-thumb ${i===img?'active':''}`} onClick={() => setImg(i)}>
                      <img src={src} alt="" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="ppv-info">
              <div style={{ display:'inline-block', background:'rgba(201,160,119,.2)',
                color:GOLD, fontSize:11, fontWeight:700, padding:'4px 12px',
                borderRadius:50, letterSpacing:1, marginBottom:12 }}>
                {product.cat.ar}
              </div>
              <h1 style={{ fontSize:'clamp(24px,4vw,36px)', fontWeight:900, lineHeight:1.15,
                marginBottom:10, color:'white' }}>
                {product.nom.ar}
              </h1>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                <span style={{ color:'#f59e0b', fontSize:15 }}>★★★★★</span>
                <span style={{ fontSize:12, color:'rgba(255,255,255,.6)' }}>4.9 (127 تقييم)</span>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:16 }}>
                <span style={{ fontSize:32, fontWeight:900, color:'white' }}>{product.prix} <span style={{ fontSize:16 }}>د.م</span></span>
                {product.old && <>
                  <span style={{ fontSize:18, textDecoration:'line-through', color:'rgba(255,255,255,.4)' }}>{product.old}</span>
                  <span style={{ background:RED, color:'white', fontSize:12, fontWeight:800,
                    padding:'3px 10px', borderRadius:50 }}>
                    وفّر {product.old - product.prix} د.م
                  </span>
                </>}
              </div>
              <p style={{ fontSize:14, color:'rgba(255,255,255,.72)', lineHeight:1.85, marginBottom:20 }}>
                {product.desc?.ar ||
                  `حذاء ${product.nom.ar} — جلد طبيعي 100٪ من دباغات فاس، صنع يدوي حرفي أصيل. يجمع بين الأناقة التقليدية المغربية والراحة العصرية.`}
              </p>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
                {['🌿 جلد 100٪','✋ صنع يدوي','🚚 توصيل 48 ساعة','🛡️ ضمان سنتين'].map(b => (
                  <span key={b} style={{ background:'rgba(201,160,119,.15)',
                    border:'1px solid rgba(201,160,119,.3)',
                    color:GOLD, fontSize:11, fontWeight:600, padding:'5px 12px',
                    borderRadius:50 }}>
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Stats bar ── */}
        <div style={{ background:BRAND }}>
          <div style={{ maxWidth:1060, margin:'0 auto', padding:'14px 16px',
            display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, textAlign:'center' }}>
            {[['+2000','زبون سعيد'],['24-48h','التوصيل'],['100٪','جلد طبيعي'],['سنتان','الضمان']].map(([n,l]) => (
              <div key={n}>
                <div style={{ fontSize:18, fontWeight:900, color:'white' }}>{n}</div>
                <div style={{ fontSize:11, color:'rgba(255,255,255,.8)' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Video Section ── */}
        <div className="ppv-video-wrap">
          <div style={{ maxWidth:760, margin:'0 auto' }}>
            <div style={{ fontSize:11, letterSpacing:3, color:GOLD, textTransform:'uppercase', marginBottom:10 }}>
              الحرفة والأصالة
            </div>
            <h2 style={{ fontSize:'clamp(20px,3.5vw,28px)', fontWeight:900, color:'white',
              lineHeight:1.3, marginBottom:8 }}>
              كيف يُصنع الجلد الطبيعي<br />في مدينة فاس العريقة؟
            </h2>
            <p style={{ fontSize:14, color:'rgba(255,255,255,.65)', marginBottom:28, lineHeight:1.8 }}>
              تقنية الدباغة التقليدية في فاس تعود لأكثر من ألف عام، وتمنح الجلد متانة وجمالاً لا يضاهيهما أي مادة اصطناعية.
            </p>
            <div className="ppv-video-frame">
              <iframe
                src={`https://www.youtube.com/embed/${VIDEO_ID}?rel=0&modestbranding=1`}
                title="How Leather Is Made in Morocco"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* ── Features ── */}
        <div style={{ padding:'52px 0' }}>
          <div className="ppv-section">
            <div style={{ textAlign:'center', marginBottom:32 }}>
              <h2 style={{ fontSize:'clamp(18px,3vw,24px)', fontWeight:800, color:MID }}>
                لماذا تختار فارس؟
              </h2>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:20 }}>
              {[
                ['🌿','جلد طبيعي أصيل','نستخدم حصراً الجلد الطبيعي من دباغات فاس العريقة. لا مواد اصطناعية، لا مساومة على الجودة.'],
                ['✋','صنع يدوي بالكامل','كل زوج يتطلب 6 ساعات عمل يدوي دقيق من أمهر الحرفيين. قطعة فنية بمعنى الكلمة.'],
                ['🛡️','ضمان سنتين كاملتين','نقف خلف كل منتج بضمان حقيقي. أي عيب في الصنعة نصلحه مجاناً.'],
              ].map(([icon,title,desc]) => (
                <div key={title} style={{ textAlign:'center', padding:'24px 16px' }}>
                  <div style={{ fontSize:36, marginBottom:12 }}>{icon}</div>
                  <div style={{ fontSize:16, fontWeight:800, color:MID, marginBottom:8 }}>{title}</div>
                  <div style={{ fontSize:13, color:'#888', lineHeight:1.8 }}>{desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Order Section ── */}
        <div className="ppv-order-section">
          <div style={{ maxWidth:760, margin:'0 auto', textAlign:'center', marginBottom:28 }}>
            <h2 style={{ fontSize:'clamp(20px,3.5vw,28px)', fontWeight:900, color:MID, marginBottom:6 }}>
              اطلب الآن — الدفع عند الاستلام
            </h2>
            <p style={{ fontSize:13, color:'#888' }}>
              أكمل بياناتك وسيتصل بك فريقنا خلال 24 ساعة لتأكيد التوصيل
            </p>
          </div>

          <div className="ppv-order-inner">
            {/* Product summary */}
            <div style={{ display:'flex', gap:16, alignItems:'center', marginBottom:24,
              background:CREAM, borderRadius:12, padding:'12px 16px' }}>
              <img src={product.imgs[img]} alt=""
                style={{ width:60, height:60, borderRadius:10, objectFit:'cover', flexShrink:0 }} />
              <div>
                <div style={{ fontSize:14, fontWeight:700, color:MID }}>{product.nom.ar}</div>
                <div style={{ fontSize:12, color:'#888' }}>{product.cat.ar}</div>
              </div>
              <div style={{ marginRight:'auto', fontSize:18, fontWeight:900, color:MID }}>{product.prix} د.م</div>
            </div>

            {success ? (
              <div style={{ textAlign:'center', padding:24 }}>
                <div style={{ fontSize:48, marginBottom:12 }}>✅</div>
                <div style={{ fontSize:20, fontWeight:900, color:'#166534', marginBottom:8 }}>تم تأكيد طلبك!</div>
                <div style={{ background:'#dcfce7', color:'#16a34a', display:'inline-block',
                  padding:'4px 18px', borderRadius:50, fontSize:14, fontWeight:700, marginBottom:14 }}>
                  رقم الطلب: {success.ref}
                </div>
                <p style={{ fontSize:13, color:'#666', lineHeight:1.8, marginBottom:18 }}>
                  سيتصل بك فريق فارس خلال 24 ساعة لتأكيد موعد التوصيل. شكراً!
                </p>
                <button onClick={() => setSuccess(null)}
                  style={{ background:MID, color:'white', border:'none', borderRadius:10,
                    padding:'10px 28px', fontSize:13, fontWeight:700, cursor:'pointer',
                    fontFamily:'Tajawal,sans-serif' }}>
                  طلب آخر
                </button>
              </div>
            ) : (
              <>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ fontSize:11, color:'#999', display:'block', marginBottom:4 }}>الاسم الكامل *</label>
                    <input className="ppv-input" placeholder="محمد الاسم" value={form.nom} onChange={set('nom')} />
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:'#999', display:'block', marginBottom:4 }}>رقم الهاتف *</label>
                    <input className="ppv-input" placeholder="06XXXXXXXX" value={form.tel} onChange={set('tel')}
                      dir="ltr" style={{ textAlign:'right' }} />
                  </div>
                </div>

                <div style={{ marginBottom:12 }}>
                  <label style={{ fontSize:11, color:'#999', display:'block', marginBottom:4 }}>العنوان الكامل *</label>
                  <input className="ppv-input" placeholder="الشارع، الحي، المدينة"
                    value={form.adresse} onChange={set('adresse')} />
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginBottom:12 }}>
                  <div>
                    <label style={{ fontSize:11, color:'#999', display:'block', marginBottom:4 }}>المدينة *</label>
                    <select className="ppv-input" value={form.ville} onChange={set('ville')} style={{ cursor:'pointer' }}>
                      <option value="">اختر المدينة...</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize:11, color:'#999', display:'block', marginBottom:4 }}>المقاس (EU)</label>
                    <select className="ppv-input" value={form.taille} onChange={set('taille')} style={{ cursor:'pointer' }}>
                      <option value="">اختر...</option>
                      {(product.tailles || [39,40,41,42,43,44,45]).map(t =>
                        <option key={t} value={String(t)}>EU {t}</option>)}
                    </select>
                  </div>
                </div>

                {product.couleurs?.length > 0 && (
                  <div style={{ marginBottom:14 }}>
                    <label style={{ fontSize:11, color:'#999', display:'block', marginBottom:6 }}>اللون</label>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {product.couleurs.map(c => (
                        <button key={c} onClick={() => setForm(f => ({ ...f, couleur:c }))}
                          style={{ padding:'6px 16px', borderRadius:50,
                            border:`1.5px solid ${form.couleur===c ? BRAND : '#e0d4c8'}`,
                            background: form.couleur===c ? BRAND : 'white',
                            color: form.couleur===c ? 'white' : '#555',
                            fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Tajawal,sans-serif' }}>
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {error && (
                  <div style={{ background:'#fef2f2', color:RED, borderRadius:8,
                    padding:'9px 14px', fontSize:12, marginBottom:12 }}>
                    ⚠️ {error}
                  </div>
                )}

                <button onClick={submit} disabled={loading}
                  style={{ width:'100%', padding:16, background: loading ? '#ccc' : MID,
                    color:'white', border:'none', borderRadius:12, fontSize:15, fontWeight:800,
                    cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'Tajawal,sans-serif',
                    transition:'background 0.2s', marginBottom:12 }}>
                  {loading ? 'جاري الإرسال...' : `اطلب الآن — ${product.prix} د.م | الدفع عند الاستلام`}
                </button>

                <div style={{ display:'flex', justifyContent:'center', gap:16, flexWrap:'wrap' }}>
                  {['🔒 دفع آمن 100٪','🚚 توصيل 24-48 ساعة','↩️ إرجاع 14 يوماً','🛡️ ضمان سنتين'].map(t => (
                    <span key={t} style={{ fontSize:10, color:'#aaa' }}>{t}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Reviews ── */}
        <div style={{ padding:'52px 0' }}>
          <div className="ppv-section">
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <h2 style={{ fontSize:'clamp(18px,3vw,24px)', fontWeight:800, color:MID }}>
                ماذا قال زبائننا
              </h2>
            </div>
            <div className="ppv-reviews">
              {REVIEWS.map(r => (
                <div key={r.name} className="ppv-review">
                  <div style={{ color:'#f59e0b', fontSize:14, marginBottom:8 }}>
                    {'★'.repeat(r.stars)}
                  </div>
                  <p style={{ fontSize:13, color:'#555', lineHeight:1.8, marginBottom:12 }}>"{r.text}"</p>
                  <div style={{ fontSize:12, fontWeight:700, color:MID }}>{r.name}</div>
                  <div style={{ fontSize:11, color:'#aaa' }}>{r.city}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Related ── */}
        <div style={{ paddingBottom:48 }}>
          <div className="ppv-section">
            <div style={{ fontSize:'clamp(16px,3vw,20px)', fontWeight:800, color:MID, marginBottom:16 }}>
              قد يعجبك أيضاً
            </div>
            <div style={{ display:'flex', gap:14, overflowX:'auto', paddingBottom:6, scrollbarWidth:'none' }}>
              {related.map(p => (
                <div key={p.slug} onClick={() => onProduct && onProduct(p.slug)}
                  style={{ flex:'0 0 160px', borderRadius:12, overflow:'hidden',
                    border:'1px solid #f0e8df', cursor:'pointer', background:'white',
                    transition:'transform 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.transform='translateY(-3px)'}
                  onMouseOut={e => e.currentTarget.style.transform='none'}>
                  <img src={p.imgs[0]} alt={p.nom.ar}
                    style={{ width:'100%', aspectRatio:'1', objectFit:'cover', display:'block' }} />
                  <div style={{ padding:'8px 10px' }}>
                    <div style={{ fontSize:12, fontWeight:700, color:MID, marginBottom:2 }}>{p.nom.ar}</div>
                    <div style={{ fontSize:12, fontWeight:900, color:BRAND }}>{p.prix} د.م</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer style={{ background:DARK, color:'#c4a882', padding:'32px 20px', textAlign:'center',
          borderTop:`1px solid rgba(201,160,119,.15)` }}>
          <div style={{ fontFamily:'Pinyon Script,cursive', fontSize:40, color:GOLD, marginBottom:8 }}>Faris</div>
          <div style={{ fontSize:13, color:'#6a4c2a', marginBottom:6 }}>
            حرفية فاسية أصيلة — جلد طبيعي، صنع يدوياً منذ أجيال
          </div>
          <div style={{ fontSize:11, color:'#3a2010' }}>© 2025 Faris Store · فاس، المغرب</div>
        </footer>

        {/* WhatsApp */}
        <a href="https://wa.me/212642499661" target="_blank" rel="noopener noreferrer"
          style={{ position:'fixed', bottom:20, left:20, zIndex:999,
            background:'#25D366', borderRadius:'50%', width:52, height:52,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:26, boxShadow:'0 4px 20px rgba(37,211,102,.45)',
            textDecoration:'none' }}>
          💬
        </a>
      </div>
    </>
  )
}
