import React from 'react'
import { PRODUCTS } from '../data/products.js'

const BRAND = '#A0714F'
const GOLD  = '#C9A077'
const DARK  = '#2C1A0E'
const RED   = '#e53935'

const BENEFITS = [
  '🌿 جلد طبيعي 100٪',
  '✋ صنع يدوياً في فاس',
  '🚚 توصيل 24-48 ساعة',
  '💳 الدفع عند الاستلام',
  '🛡️ ضمان سنتين كاملتين',
  '⭐ تقييم 4.9 من 5',
  '↩️ إرجاع خلال 14 يوماً',
  '📦 التغليف الفاخر مجاناً',
]

const CATS = [
  { slug: 'rbati',   name: 'تشيلسي بروغ',  sub: 'الكلاسيك المغربي الأصيل',   img: PRODUCTS[0].imgs[0] },
  { slug: 'fassi',   name: 'حذاء بالأربطة', sub: 'تقاليد فاس العريقة',         img: PRODUCTS[1].imgs[0] },
  { slug: 'chaouen', name: 'سنيكرز شاوين',  sub: 'خفيف وأنيق للمدينة',         img: PRODUCTS[2].imgs[0] },
  { slug: 'tanger',  name: 'موكاسين طنجاوي',sub: 'نعومة مطلقة وخفة رائعة',    img: PRODUCTS[4].imgs[0] },
]

const CSS = `
  .fat-hero {
    display: grid;
    grid-template-columns: 1.1fr 0.9fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 8px;
    height: 68vh;
    min-height: 380px;
  }
  .fat-b1  { grid-area: 1/1/3/2; }
  .fat-b2a { grid-area: 1/2/2/3; }
  .fat-b2b { grid-area: 2/2/3/3; }
  .fat-b3  { grid-area: 1/3/3/4; }

  .fat-hblock {
    position: relative; overflow: hidden;
    border-radius: 14px; cursor: pointer;
  }
  .fat-hblock img {
    width: 100%; height: 100%;
    object-fit: cover; display: block;
    transition: transform 0.45s ease;
  }
  .fat-hblock:hover img { transform: scale(1.06); }
  .fat-hoverlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(20,6,0,.72) 0%, transparent 55%);
  }
  .fat-hcontent {
    position: absolute; bottom: 0; right: 0; left: 0;
    padding: 14px 16px; z-index: 2;
  }
  .fat-hbtn {
    display: inline-block; margin-top: 8px;
    padding: 7px 18px; background: ${GOLD}; color: ${DARK};
    border: none; border-radius: 50px; font-family: Tajawal,sans-serif;
    font-size: 12px; font-weight: 800; cursor: pointer;
    transition: background 0.2s;
  }
  .fat-hbtn:hover { background: #fff; }

  .fat-scroll-wrap { overflow: hidden; }
  .fat-scroll-track {
    display: flex; width: max-content;
    animation: fat-slide 28s linear infinite;
  }
  .fat-scroll-track:hover { animation-play-state: paused; }
  @keyframes fat-slide {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  .fat-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 10px 22px; flex-shrink: 0;
    border-left: 1px solid #e8ddd2;
    font-size: 13px; font-weight: 600; color: #4a3520;
    font-family: Tajawal,sans-serif; white-space: nowrap;
  }

  .fat-cats {
    display: grid;
    grid-template-columns: repeat(4,1fr);
    gap: 12px;
  }
  .fat-cat {
    position: relative; border-radius: 14px;
    overflow: hidden; height: 190px; cursor: pointer;
  }
  .fat-cat img { width:100%; height:100%; object-fit:cover; transition: transform .4s; }
  .fat-cat:hover img { transform: scale(1.07); }
  .fat-catoverlay {
    position:absolute; inset:0;
    background: linear-gradient(to top,rgba(0,0,0,.65) 0%,transparent 55%);
  }
  .fat-catcontent { position:absolute; bottom:12px; right:12px; left:12px; }

  .fat-grid {
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap: 16px;
  }
  .fat-card {
    border-radius: 14px; overflow: hidden;
    background: #fff; border: 1px solid #f0e8df;
    cursor: pointer; transition: box-shadow .25s, transform .25s;
  }
  .fat-card:hover {
    box-shadow: 0 8px 28px rgba(160,113,79,.18);
    transform: translateY(-4px);
  }

  @media (max-width: 760px) {
    .fat-hero {
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 200px 140px 180px;
      height: auto;
    }
    .fat-b1  { grid-area: 1/1/2/3; }
    .fat-b2a { grid-area: 2/1/3/2; }
    .fat-b2b { grid-area: 2/2/3/3; }
    .fat-b3  { grid-area: 3/1/4/3; }
    .fat-cats { grid-template-columns: repeat(2,1fr); }
    .fat-grid { grid-template-columns: repeat(2,1fr); gap: 10px; }
  }
`

export default function ThemeArabic({ lang, onLangToggle, onProduct }) {
  const doubled = [...BENEFITS, ...BENEFITS]

  return (
    <>
      <style>{CSS}</style>
      <div style={{ background:'#fff', minHeight:'100vh', direction:'rtl', fontFamily:'Tajawal,Cairo,sans-serif', color:'#1a1a1a' }}>

        {/* ── Notice bar ── */}
        <div style={{ background:`linear-gradient(135deg,${BRAND},${DARK})`, color:'white',
          textAlign:'center', padding:'9px 16px', fontSize:13, fontWeight:600 }}>
          إرجاع مجاني خلال 14 يوماً · توصيل 24-48 ساعة · الدفع عند الاستلام
        </div>

        {/* ── Header ── */}
        <header style={{ background:'#fff', borderBottom:'1px solid #f0e8df',
          padding:'12px 20px', position:'sticky', top:0, zIndex:100,
          display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', gap:20, alignItems:'center' }}>
            {['المنتجات','من نحن','اتصل بنا'].map(l => (
              <a key={l} href="#" onClick={e => { e.preventDefault(); if(l==='المنتجات') onProduct('rbati') }}
                style={{ fontSize:13, color:'#444', textDecoration:'none', fontWeight:600 }}>
                {l}
              </a>
            ))}
          </div>

          <span style={{ fontFamily:'Pinyon Script,cursive', fontSize:34, color:DARK, lineHeight:1 }}>
            Faris
          </span>

          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <span style={{ fontSize:20, cursor:'pointer', color:'#555' }}>🔍</span>
            <button onClick={onLangToggle}
              style={{ background:'none', border:`1px solid #ddd`, borderRadius:6,
                padding:'4px 10px', fontSize:12, cursor:'pointer', color:'#555' }}>
              FR
            </button>
          </div>
        </header>

        <div style={{ maxWidth:1100, margin:'0 auto', padding:'16px 16px 0' }}>

          {/* ── Hero Grid ── */}
          <div className="fat-hero" style={{ marginBottom:16 }}>

            {/* Block 1 — large right */}
            <div className="fat-hblock fat-b1" onClick={() => onProduct('rbati')}>
              <img src={PRODUCTS[0].imgs[0]} alt={PRODUCTS[0].nom.ar} />
              <div className="fat-hoverlay" />
              <div className="fat-hcontent">
                <div style={{ color:'rgba(255,255,255,.7)', fontSize:10, letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>
                  تشيلسي بروغ
                </div>
                <div style={{ color:'white', fontSize:'clamp(16px,2.5vw,22px)', fontWeight:900, lineHeight:1.15 }}>
                  الرباطي
                </div>
                <div style={{ color:GOLD, fontSize:13, marginTop:3 }}>
                  تخفيض 25٪ — {PRODUCTS[0].prix} د.م
                </div>
                <button className="fat-hbtn">اطلب الآن</button>
              </div>
            </div>

            {/* Block 2a — top middle */}
            <div className="fat-hblock fat-b2a" onClick={() => onProduct('fassi')}>
              <img src={PRODUCTS[1].imgs[0]} alt={PRODUCTS[1].nom.ar} />
              <div className="fat-hoverlay" />
              <div className="fat-hcontent">
                <div style={{ color:'white', fontSize:15, fontWeight:800 }}>{PRODUCTS[1].nom.ar}</div>
                <div style={{ color:GOLD, fontSize:12 }}>{PRODUCTS[1].prix} د.م</div>
                <button className="fat-hbtn" style={{ padding:'5px 14px', fontSize:11 }}>اطلب الآن</button>
              </div>
            </div>

            {/* Block 2b — bottom middle */}
            <div className="fat-hblock fat-b2b" onClick={() => onProduct('chaouen')}>
              <img src={PRODUCTS[2].imgs[0]} alt={PRODUCTS[2].nom.ar} />
              <div className="fat-hoverlay" />
              <div className="fat-hcontent">
                <div style={{ color:'white', fontSize:15, fontWeight:800 }}>{PRODUCTS[2].nom.ar}</div>
                <div style={{ color:GOLD, fontSize:12 }}>خصم 20٪ — {PRODUCTS[2].prix} د.م</div>
                <button className="fat-hbtn" style={{ padding:'5px 14px', fontSize:11 }}>اطلب الآن</button>
              </div>
            </div>

            {/* Block 3 — large left */}
            <div className="fat-hblock fat-b3" onClick={() => onProduct('tanger')}>
              <img src={PRODUCTS[4].imgs[0]} alt={PRODUCTS[4].nom.ar} />
              <div className="fat-hoverlay" />
              <div className="fat-hcontent">
                <div style={{ color:'rgba(255,255,255,.7)', fontSize:10, letterSpacing:3, marginBottom:4 }}>
                  موكاسين
                </div>
                <div style={{ color:'white', fontSize:'clamp(16px,2.5vw,22px)', fontWeight:900, lineHeight:1.15 }}>
                  الطنجاوي
                </div>
                <div style={{ color:GOLD, fontSize:13, marginTop:3 }}>
                  وفّر {PRODUCTS[4].old - PRODUCTS[4].prix} د.م اليوم فقط
                </div>
                <button className="fat-hbtn">اكتشف الآن</button>
              </div>
            </div>
          </div>

          {/* ── Benefits Scroller ── */}
          <div style={{ background:'#fdf6ef', borderRadius:12, marginBottom:24 }} className="fat-scroll-wrap">
            <div className="fat-scroll-track">
              {doubled.map((b, i) => (
                <div key={i} className="fat-chip">
                  {b}
                </div>
              ))}
            </div>
          </div>

          {/* ── Collections ── */}
          <div style={{ marginBottom:28 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ fontSize:'clamp(16px,3vw,20px)', fontWeight:800, color:DARK }}>التصنيفات</div>
              <a href="#" onClick={e => e.preventDefault()}
                style={{ fontSize:13, color:BRAND, fontWeight:600, textDecoration:'none' }}>
                عرض الكل &larr;
              </a>
            </div>
            <div className="fat-cats">
              {CATS.map(cat => (
                <div key={cat.slug} className="fat-cat" onClick={() => onProduct(cat.slug)}>
                  <img src={cat.img} alt={cat.name} />
                  <div className="fat-catoverlay" />
                  <div className="fat-catcontent">
                    <div style={{ color:'white', fontSize:'clamp(13px,2vw,16px)', fontWeight:800 }}>{cat.name}</div>
                    <div style={{ color:'rgba(255,255,255,.75)', fontSize:11, marginTop:2 }}>{cat.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Products Grid ── */}
          <div style={{ marginBottom:40 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div style={{ fontSize:'clamp(16px,3vw,20px)', fontWeight:800, color:DARK }}>الأكثر طلباً</div>
            </div>
            <div className="fat-grid">
              {PRODUCTS.map(p => (
                <div key={p.slug} className="fat-card" onClick={() => onProduct(p.slug)}>
                  <div style={{ position:'relative', overflow:'hidden' }}>
                    <img src={p.imgs[0]} alt={p.nom.ar}
                      style={{ width:'100%', aspectRatio:'1', objectFit:'cover', display:'block' }} />
                    {p.old && (
                      <div style={{ position:'absolute', top:8, left:8,
                        background:RED, color:'white', borderRadius:50,
                        padding:'3px 10px', fontSize:11, fontWeight:800 }}>
                        -{Math.round((1-p.prix/p.old)*100)}٪
                      </div>
                    )}
                    {p.badge && (
                      <div style={{ position:'absolute', top:8, right:8,
                        background:DARK+'dd', color:GOLD, borderRadius:8,
                        padding:'3px 8px', fontSize:10, fontWeight:700 }}>
                        {p.badge.ar}
                      </div>
                    )}
                  </div>
                  <div style={{ padding:'10px 12px' }}>
                    <div style={{ fontSize:10, color:BRAND, marginBottom:3, fontWeight:700, letterSpacing:1 }}>
                      {p.cat.ar}
                    </div>
                    <div style={{ fontSize:'clamp(13px,2vw,15px)', fontWeight:700, color:DARK, marginBottom:6 }}>
                      {p.nom.ar}
                    </div>
                    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                      <span style={{ fontSize:16, fontWeight:900, color:DARK }}>{p.prix} د.م</span>
                      {p.old && (
                        <span style={{ textDecoration:'line-through', color:'#bbb', fontSize:12 }}>{p.old}</span>
                      )}
                    </div>
                    <button style={{ width:'100%', padding:'9px', background:DARK, color:'white',
                      border:'none', borderRadius:8, fontSize:12, fontWeight:800,
                      cursor:'pointer', fontFamily:'Tajawal,sans-serif',
                      transition:'background .2s' }}
                      onMouseOver={e => e.target.style.background=BRAND}
                      onMouseOut={e => e.target.style.background=DARK}>
                      اطلب الآن
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Trust Section ── */}
          <div style={{ background:'#fdf6ef', borderRadius:16, padding:'28px 20px',
            marginBottom:32, display:'grid', gridTemplateColumns:'repeat(3,1fr)',
            gap:16, textAlign:'center' }}>
            {[
              ['🚚','توصيل سريع','24-48 ساعة لجميع مدن المغرب'],
              ['💳','دفع عند الاستلام','ادفع فقط عند استلام طلبك'],
              ['🛡️','ضمان سنتين','إصلاح مجاني لمدة عامين كاملين'],
            ].map(([icon,title,desc]) => (
              <div key={title}>
                <div style={{ fontSize:32, marginBottom:8 }}>{icon}</div>
                <div style={{ fontSize:14, fontWeight:800, color:DARK, marginBottom:4 }}>{title}</div>
                <div style={{ fontSize:12, color:'#888', lineHeight:1.5 }}>{desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Footer ── */}
        <footer style={{ background:DARK, color:'#c4a882', padding:'36px 20px', textAlign:'center' }}>
          <div style={{ fontFamily:'Pinyon Script,cursive', fontSize:40, color:GOLD, marginBottom:8 }}>
            Faris
          </div>
          <div style={{ fontSize:13, marginBottom:16, color:'#9a7a55' }}>
            حرفية فاسية أصيلة — جلد طبيعي، صنع يدوياً منذ أجيال
          </div>
          <div style={{ display:'flex', gap:18, justifyContent:'center', marginBottom:20, flexWrap:'wrap' }}>
            {['عن المتجر','سياسة الإرجاع','اتصل بنا','الشحن والتوصيل'].map(l => (
              <a key={l} href="#" style={{ color:'#7a5c3a', fontSize:12, textDecoration:'none' }}>{l}</a>
            ))}
          </div>
          <div style={{ fontSize:11, color:'#4a3020' }}>© 2025 Faris Store · فاس، المغرب</div>
        </footer>

        {/* ── WhatsApp ── */}
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
