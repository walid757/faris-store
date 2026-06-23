import React, { useState } from 'react'
import { PRODUCTS } from '../data/products.js'
import { createOrder } from '../api/client.js'

const BRAND = '#A0714F'
const GOLD  = '#C9A077'
const DARK  = '#2C1A0E'
const RED   = '#e53935'

const CITIES = [
  'الدار البيضاء','الرباط','فاس','مراكش','أكادير','طنجة','مكناس','وجدة',
  'القنيطرة','تطوان','الجديدة','سطات','بني ملال','خريبكة','الناظور','أخرى'
]

const FAQS = [
  ['كيف أعرف مقاسي الصحيح؟',
   'قس طول قدمك من الكعب لرأس أطول إصبع. المقاس 40 = 26 سم، 41 = 26.5 سم، 42 = 27 سم، 43 = 27.5 سم، 44 = 28 سم، 45 = 28.5 سم.'],
  ['كم يستغرق التوصيل؟',
   'التوصيل 24 إلى 48 ساعة لجميع مدن المغرب. في المناطق البعيدة قد يصل لـ72 ساعة.'],
  ['هل يمكن الإرجاع أو التبديل؟',
   'نعم، نقبل الإرجاع والتبديل خلال 14 يوماً من تاريخ الاستلام شرط أن يكون الحذاء سليماً وبغلافه الأصلي.'],
  ['ما المواد المستخدمة؟',
   'جلد طبيعي 100٪ من دباغات فاس العريقة، نعل مطاط مقوّى، خيوط قطنية. لا مواد اصطناعية.'],
  ['هل الدفع عند الاستلام متاح؟',
   'نعم، الدفع عند الاستلام متاح في جميع مدن المغرب دون أي رسوم إضافية.'],
]

const CSS = `
  .ppa-page { background:#fff; min-height:100vh; direction:rtl; font-family:Tajawal,Cairo,sans-serif; color:#1a1a1a; }

  .ppa-hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 36px;
    align-items: start;
  }
  .ppa-thumbs {
    display: flex; gap: 8px; margin-top: 10px; flex-wrap: wrap;
  }
  .ppa-thumb {
    width: 68px; height: 68px; border-radius: 10px; overflow: hidden;
    cursor: pointer; border: 2px solid transparent; transition: border-color 0.2s;
    flex-shrink: 0;
  }
  .ppa-thumb.active { border-color: ${BRAND}; }
  .ppa-thumb img { width:100%; height:100%; object-fit:cover; }

  .ppa-tabs { display:flex; gap:8px; flex-wrap:wrap; margin-bottom:20px; }
  .ppa-tab {
    padding: 9px 18px; border-radius: 50px;
    border: 1.5px solid #e0d4c8; background: white;
    font-family: Tajawal,sans-serif; font-size: 13px; font-weight: 600;
    color: #666; cursor: pointer; transition: all 0.2s;
  }
  .ppa-tab.active { background: ${DARK}; color: white; border-color: ${DARK}; }

  .ppa-input {
    width: 100%; padding: 11px 14px;
    border: 1.5px solid #e0d4c8; border-radius: 10px;
    font-family: Tajawal,sans-serif; font-size: 14px; color: ${DARK};
    background: #fdfaf7; box-sizing: border-box;
    outline: none; transition: border-color 0.2s; direction: rtl;
  }
  .ppa-input:focus { border-color: ${BRAND}; background: white; }

  .ppa-faq-item { border-bottom: 1px solid #f0e8df; }
  .ppa-faq-btn {
    width: 100%; padding: 15px 0;
    display: flex; align-items: center; gap: 14px;
    background: none; border: none; cursor: pointer; text-align: right;
    font-family: Tajawal,sans-serif;
  }
  .ppa-faq-body {
    overflow: hidden; max-height: 0;
    transition: max-height 0.35s ease, padding 0.35s ease;
    padding: 0 0 0 12px;
  }
  .ppa-faq-body.open { max-height: 180px; padding-bottom: 14px; }

  .ppa-related {
    display: flex; gap: 14px; overflow-x: auto; padding-bottom: 6px;
    scrollbar-width: none;
  }
  .ppa-related::-webkit-scrollbar { display: none; }
  .ppa-rcard {
    flex: 0 0 150px; border-radius: 12px; overflow: hidden;
    border: 1px solid #f0e8df; cursor: pointer; background: white;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  .ppa-rcard:hover { transform: translateY(-3px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }

  @media (max-width: 768px) {
    .ppa-hero { grid-template-columns: 1fr; gap: 20px; }
  }
`

export default function ProductPageArabic({ slug, lang, onLangToggle, onBack, onProduct }) {
  const product = PRODUCTS.find(p => p.slug === slug) || PRODUCTS[0]
  const related  = PRODUCTS.filter(p => p.slug !== slug).slice(0, 5)

  const [img,      setImg]      = useState(0)
  const [tab,      setTab]      = useState(0)
  const [openFaq,  setOpenFaq]  = useState(null)
  const [form,     setForm]     = useState({
    nom: '', tel: '', adresse: '', ville: '',
    couleur: product.couleurs?.[0] || '',
    taille:  ''
  })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(null)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.nom.trim())              return setError('يرجى إدخال الاسم الكامل')
    if (!/^0[67]\d{8}$/.test(form.tel)) return setError('رقم الهاتف غير صحيح (06XXXXXXXX أو 07XXXXXXXX)')
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

  const TABS = [
    { label: 'المواصفات', icon: '📋' },
    { label: 'الألوان والمقاسات', icon: '🎨' },
    { label: 'الشحن والتوصيل', icon: '🚚' },
    { label: 'الضمان والإرجاع', icon: '🛡️' },
  ]

  const SPEC_GRID = [
    ['المادة','جلد طبيعي 100٪'],['الصنع','يدوي، فاس'],
    ['النعل','مطاط مقوّى'],['الخيوط','قطن طبيعي'],
    ['الضمان','سنتان'],['الشحن','24-48 ساعة'],
  ]

  const renderTab = () => {
    if (tab === 0) return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {SPEC_GRID.map(([k,v]) => (
          <div key={k} style={{ background:'#fdf6ef', borderRadius:8, padding:'10px 12px' }}>
            <div style={{ fontSize:10, color:'#999', marginBottom:2 }}>{k}</div>
            <div style={{ fontSize:13, fontWeight:700, color:DARK }}>{v}</div>
          </div>
        ))}
      </div>
    )

    if (tab === 1) return (
      <div>
        {product.couleurs?.length > 0 && (
          <div style={{ marginBottom:16 }}>
            <div style={{ fontSize:13, fontWeight:700, color:DARK, marginBottom:8 }}>الألوان المتوفرة</div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {product.couleurs.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, couleur:c }))}
                  style={{ padding:'6px 16px', borderRadius:50,
                    border:`1.5px solid ${form.couleur===c ? BRAND : '#e0d4c8'}`,
                    background: form.couleur===c ? BRAND : 'white',
                    color: form.couleur===c ? 'white' : '#444',
                    fontSize:12, fontWeight:600, cursor:'pointer', fontFamily:'Tajawal,sans-serif' }}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}
        <div>
          <div style={{ fontSize:13, fontWeight:700, color:DARK, marginBottom:8 }}>المقاسات الأوروبية</div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            {(product.tailles || [39,40,41,42,43,44,45]).map(t => (
              <button key={t} onClick={() => setForm(f => ({ ...f, taille: String(t) }))}
                style={{ width:44, height:44, borderRadius:8,
                  border:`1.5px solid ${form.taille===String(t) ? BRAND : '#e0d4c8'}`,
                  background: form.taille===String(t) ? BRAND : 'white',
                  color: form.taille===String(t) ? 'white' : '#444',
                  fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'Tajawal,sans-serif' }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>
    )

    if (tab === 2) return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {[['🚚','الشحن السريع','24-48 ساعة لجميع مدن المغرب'],
          ['💳','الدفع عند الاستلام','ادفع فقط عند استلام طلبك'],
          ['📦','تغليف فاخر','علبة هدايا مميزة مجاناً'],
          ['📍','تتبع الطلب','رسالة تأكيد برقم الطلب'],
        ].map(([icon,title,desc]) => (
          <div key={title} style={{ background:'#fdf6ef', borderRadius:10, padding:12 }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
            <div style={{ fontSize:13, fontWeight:700, color:DARK, marginBottom:3 }}>{title}</div>
            <div style={{ fontSize:11, color:'#888' }}>{desc}</div>
          </div>
        ))}
      </div>
    )

    return (
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
        {[['🛡️','ضمان سنتين','إصلاح مجاني لأي عيب في الصنعة'],
          ['↩️','إرجاع 14 يوماً','إرجاع سهل دون أسئلة'],
          ['🔄','تبديل المقاس','مجاناً إن لم يناسبك'],
          ['⭐','جودة مضمونة','جلد طبيعي أو استرداد كامل'],
        ].map(([icon,title,desc]) => (
          <div key={title} style={{ background:'#fdf6ef', borderRadius:10, padding:12 }}>
            <div style={{ fontSize:22, marginBottom:6 }}>{icon}</div>
            <div style={{ fontSize:13, fontWeight:700, color:DARK, marginBottom:3 }}>{title}</div>
            <div style={{ fontSize:11, color:'#888' }}>{desc}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="ppa-page">

        {/* ── Header ── */}
        <header style={{ background:'#fff', borderBottom:'1px solid #f0e8df', padding:'12px 20px',
          position:'sticky', top:0, zIndex:100,
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <button onClick={onBack}
            style={{ background:'none', border:'none', cursor:'pointer', display:'flex',
              alignItems:'center', gap:6, color:'#555', fontSize:13, fontWeight:600,
              fontFamily:'Tajawal,sans-serif' }}>
            → رجوع للمتجر
          </button>
          <span style={{ fontFamily:'Pinyon Script,cursive', fontSize:30, color:DARK }}>Faris</span>
          <button onClick={onLangToggle}
            style={{ background:'none', border:'1px solid #ddd', borderRadius:6,
              padding:'4px 10px', fontSize:12, cursor:'pointer', color:'#555' }}>
            FR
          </button>
        </header>

        <div style={{ maxWidth:1060, margin:'0 auto', padding:'28px 16px' }}>

          {/* ── Hero ── */}
          <div className="ppa-hero">

            {/* Image gallery */}
            <div>
              <div style={{ borderRadius:18, overflow:'hidden', background:'#f8f3ee' }}>
                <img src={product.imgs[img]} alt={product.nom.ar}
                  style={{ width:'100%', aspectRatio:'1', objectFit:'cover', display:'block' }} />
              </div>
              {product.imgs.length > 1 && (
                <div className="ppa-thumbs">
                  {product.imgs.map((src, i) => (
                    <div key={i} className={`ppa-thumb ${i===img?'active':''}`} onClick={() => setImg(i)}>
                      <img src={src} alt="" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Product info + form */}
            <div>
              {/* Category */}
              <div style={{ display:'inline-block', background:'#fdf6ef', color:BRAND,
                fontSize:11, fontWeight:700, padding:'4px 12px', borderRadius:50,
                letterSpacing:1, marginBottom:10 }}>
                {product.cat.ar}
              </div>

              {/* Name */}
              <h1 style={{ fontSize:'clamp(22px,4vw,30px)', fontWeight:900, color:DARK,
                lineHeight:1.2, margin:'0 0 10px' }}>
                {product.nom.ar}
              </h1>

              {/* Rating */}
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:14 }}>
                <span style={{ color:'#f59e0b', fontSize:14 }}>★★★★★</span>
                <span style={{ fontSize:12, color:'#888' }}>4.9 (127 تقييم)</span>
                <span style={{ background:'#dcfce7', color:'#16a34a', fontSize:11, fontWeight:700,
                  padding:'2px 8px', borderRadius:50 }}>
                  متوفر
                </span>
              </div>

              {/* Price */}
              <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:16 }}>
                <span style={{ fontSize:28, fontWeight:900, color:DARK }}>{product.prix} د.م</span>
                {product.old && <>
                  <span style={{ fontSize:16, textDecoration:'line-through', color:'#bbb' }}>{product.old}</span>
                  <span style={{ background:'#fef2f2', color:RED, fontSize:12, fontWeight:800,
                    padding:'3px 10px', borderRadius:50 }}>
                    وفّر {product.old - product.prix} د.م
                  </span>
                </>}
              </div>

              {/* Description */}
              <p style={{ fontSize:14, color:'#666', lineHeight:1.85, marginBottom:20 }}>
                {product.desc?.ar ||
                  `حذاء ${product.nom.ar} المصنوع يدوياً من جلد طبيعي 100٪ في مدينة فاس. يجمع بين الأناقة التقليدية المغربية والراحة العصرية. مثالي للمناسبات والاستخدام اليومي.`}
              </p>

              {/* ── Order form / Success ── */}
              {success ? (
                <div style={{ background:'#f0fdf4', border:'1.5px solid #86efac',
                  borderRadius:16, padding:28, textAlign:'center' }}>
                  <div style={{ fontSize:44, marginBottom:10 }}>✅</div>
                  <div style={{ fontSize:18, fontWeight:900, color:'#166534', marginBottom:6 }}>
                    تم تأكيد طلبك!
                  </div>
                  <div style={{ fontSize:14, color:'#16a34a', fontWeight:700, marginBottom:12,
                    background:'#dcfce7', display:'inline-block', padding:'4px 16px', borderRadius:50 }}>
                    رقم الطلب: {success.ref}
                  </div>
                  <p style={{ fontSize:13, color:'#555', lineHeight:1.8, marginBottom:18 }}>
                    سيتصل بك فريقنا خلال 24 ساعة لتأكيد موعد التوصيل. شكراً لثقتك في فارس!
                  </p>
                  <button onClick={() => setSuccess(null)}
                    style={{ background:DARK, color:'white', border:'none', borderRadius:10,
                      padding:'10px 28px', fontSize:13, fontWeight:700, cursor:'pointer',
                      fontFamily:'Tajawal,sans-serif' }}>
                    طلب آخر
                  </button>
                </div>
              ) : (
                <div style={{ background:'#fdf6ef', borderRadius:16, padding:20 }}>
                  <div style={{ fontSize:15, fontWeight:800, color:DARK, marginBottom:16 }}>
                    اطلب الآن — الدفع عند الاستلام
                  </div>

                  {/* Row 1: name + phone */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                    <div>
                      <label style={{ fontSize:11, color:'#888', display:'block', marginBottom:4 }}>الاسم الكامل *</label>
                      <input className="ppa-input" placeholder="محمد الاسم" value={form.nom} onChange={set('nom')} />
                    </div>
                    <div>
                      <label style={{ fontSize:11, color:'#888', display:'block', marginBottom:4 }}>رقم الهاتف *</label>
                      <input className="ppa-input" placeholder="06XXXXXXXX" value={form.tel} onChange={set('tel')}
                        dir="ltr" style={{ textAlign:'right' }} />
                    </div>
                  </div>

                  {/* Row 2: address */}
                  <div style={{ marginBottom:10 }}>
                    <label style={{ fontSize:11, color:'#888', display:'block', marginBottom:4 }}>العنوان الكامل *</label>
                    <input className="ppa-input" placeholder="الشارع، الحي، المدينة"
                      value={form.adresse} onChange={set('adresse')} />
                  </div>

                  {/* Row 3: city + size */}
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:10 }}>
                    <div>
                      <label style={{ fontSize:11, color:'#888', display:'block', marginBottom:4 }}>المدينة *</label>
                      <select className="ppa-input" value={form.ville} onChange={set('ville')}
                        style={{ cursor:'pointer' }}>
                        <option value="">اختر المدينة...</option>
                        {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={{ fontSize:11, color:'#888', display:'block', marginBottom:4 }}>المقاس (EU)</label>
                      <select className="ppa-input" value={form.taille} onChange={set('taille')}
                        style={{ cursor:'pointer' }}>
                        <option value="">اختر...</option>
                        {(product.tailles || [39,40,41,42,43,44,45]).map(t =>
                          <option key={t} value={String(t)}>EU {t}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Colors */}
                  {product.couleurs?.length > 0 && (
                    <div style={{ marginBottom:12 }}>
                      <label style={{ fontSize:11, color:'#888', display:'block', marginBottom:6 }}>اللون</label>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                        {product.couleurs.map(c => (
                          <button key={c} onClick={() => setForm(f => ({ ...f, couleur:c }))}
                            style={{ padding:'5px 14px', borderRadius:50,
                              border:`1.5px solid ${form.couleur===c ? BRAND : '#e0d4c8'}`,
                              background: form.couleur===c ? BRAND : 'white',
                              color: form.couleur===c ? 'white' : '#555',
                              fontSize:12, fontWeight:600, cursor:'pointer',
                              fontFamily:'Tajawal,sans-serif' }}>
                            {c}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Error */}
                  {error && (
                    <div style={{ background:'#fef2f2', color:RED, borderRadius:8,
                      padding:'8px 12px', fontSize:12, marginBottom:10 }}>
                      ⚠️ {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button onClick={submit} disabled={loading}
                    style={{ width:'100%', padding:14, background: loading ? '#ccc' : DARK,
                      color:'white', border:'none', borderRadius:12, fontSize:14, fontWeight:800,
                      cursor: loading ? 'not-allowed' : 'pointer', fontFamily:'Tajawal,sans-serif',
                      transition:'background 0.2s', marginBottom:10 }}>
                    {loading ? 'جاري الإرسال...' : `اطلب الآن — ${product.prix} د.م`}
                  </button>

                  <div style={{ display:'flex', justifyContent:'center', gap:14, flexWrap:'wrap' }}>
                    {['🔒 آمن 100٪','🚚 توصيل 24-48 ساعة','↩️ إرجاع 14 يوماً'].map(t => (
                      <span key={t} style={{ fontSize:10, color:'#999' }}>{t}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ── Tabs ── */}
          <div style={{ margin:'44px 0' }}>
            <div className="ppa-tabs">
              {TABS.map((t, i) => (
                <button key={i} className={`ppa-tab ${i===tab?'active':''}`}
                  onClick={() => setTab(i)}>
                  {t.icon} {t.label}
                </button>
              ))}
            </div>
            <div style={{ background:'#fdfaf7', borderRadius:14, padding:22, minHeight:100 }}>
              {renderTab()}
            </div>
          </div>

          {/* ── FAQ ── */}
          <div style={{ marginBottom:44 }}>
            <div style={{ fontSize:'clamp(16px,3vw,20px)', fontWeight:800, color:DARK, marginBottom:20 }}>
              أسئلة شائعة
            </div>
            <div style={{ border:'1px solid #f0e8df', borderRadius:14, overflow:'hidden' }}>
              {FAQS.map(([q, a], i) => (
                <div key={i} className="ppa-faq-item">
                  <button className="ppa-faq-btn" onClick={() => setOpenFaq(openFaq===i ? null : i)}>
                    <div style={{ width:28, height:28, borderRadius:50, flexShrink:0,
                      background: openFaq===i ? BRAND : '#fdf6ef',
                      color: openFaq===i ? 'white' : BRAND,
                      fontSize:12, fontWeight:800, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      {i+1}
                    </div>
                    <div style={{ flex:1, fontSize:14, fontWeight:700, color:DARK, textAlign:'right' }}>{q}</div>
                    <span style={{ fontSize:20, color:'#bbb', marginLeft:8,
                      display:'inline-block', transition:'transform 0.25s',
                      transform: openFaq===i ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  <div className={`ppa-faq-body ${openFaq===i?'open':''}`}
                    style={{ paddingRight:42, paddingLeft:12 }}>
                    <p style={{ fontSize:13, color:'#666', lineHeight:1.8, margin:0 }}>{a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Related products ── */}
          <div style={{ marginBottom:44 }}>
            <div style={{ fontSize:'clamp(16px,3vw,20px)', fontWeight:800, color:DARK, marginBottom:14 }}>
              قد يعجبك أيضاً
            </div>
            <div className="ppa-related">
              {related.map(p => (
                <div key={p.slug} className="ppa-rcard" onClick={() => onProduct && onProduct(p.slug)}>
                  <img src={p.imgs[0]} alt={p.nom.ar}
                    style={{ width:'100%', aspectRatio:'1', objectFit:'cover', display:'block' }} />
                  <div style={{ padding:'8px 10px' }}>
                    <div style={{ fontSize:12, fontWeight:700, color:DARK, marginBottom:2 }}>{p.nom.ar}</div>
                    <div style={{ fontSize:12, fontWeight:900, color:BRAND }}>{p.prix} د.م</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer style={{ background:DARK, color:'#c4a882', padding:'28px 20px', textAlign:'center' }}>
          <div style={{ fontFamily:'Pinyon Script,cursive', fontSize:36, color:GOLD, marginBottom:6 }}>Faris</div>
          <div style={{ fontSize:12, color:'#7a5c3a', marginBottom:6 }}>
            حرفية فاسية أصيلة — جلد طبيعي، صنع يدوياً
          </div>
          <div style={{ fontSize:11, color:'#4a3020' }}>© 2025 Faris Store · فاس، المغرب</div>
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
