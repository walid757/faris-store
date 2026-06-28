import React, { useState, useEffect } from 'react'
import { PRODUCTS } from '../data/products.js'
import { createOrder } from '../api/client.js'

const P = PRODUCTS.find(p => p.slug === 'stephano') || PRODUCTS[0]

const IMGS = [
  '/products/stephano/1.png',
  '/products/stephano/2.png',
  '/products/stephano/3.png',
  '/products/stephano/4.png',
  '/products/stephano/5.png',
]

const COLOR_DATA = [
  { name: 'Noir',         nameAr: 'أسود',  hex: '#111111' },
  { name: 'Marron',       nameAr: 'بني',   hex: '#5C3D20' },
  { name: 'Gris ardoise', nameAr: 'رمادي', hex: '#5a5a6a' },
]

const SIZES = [39, 40, 41, 42, 43, 44]

const CITIES = [
  'الدار البيضاء','الرباط','فاس','مراكش','أكادير','طنجة',
  'مكناس','وجدة','القنيطرة','تطوان','الجديدة','سطات',
  'بني ملال','خريبكة','الناظور','أخرى'
]

const REVIEWS = [
  { name:'Zineb Z.', city:'Casablanca', stars:5, title:'Une élégance surprenante',
    body:"Je l'ai reçue et, Dieu merci, quelle belle surprise ! D'une légèreté incroyable et d'une élégance rare. Le service est en plus impeccable. Je recommande sans hésiter.", date:'15 juin 2026' },
  { name:'Laura S.', city:'Rabat', stars:5, title:'Conforme à la description',
    body:"Ma commande est arrivée exactement telle que présentée en photo. Rien à redire, c'est du sérieux. Entièrement satisfaite.", date:'10 juin 2026' },
  { name:'Abdelali B.', city:'Fès', stars:5, title:"L'excellence marocaine",
    body:"La créativité et le savoir-faire marocain toujours au sommet. Une marque dont nous pouvons être fiers. Continuez ainsi.", date:'5 juin 2026' },
  { name:'Yassine S.', city:'Marrakech', stars:5, title:'Chaque dirham bien dépensé',
    body:"Cette qualité-là, ça vaut vraiment chaque centime. Un vrai investissement qui tient dans la durée. Que Dieu vous bénisse.", date:'1 juin 2026' },
  { name:'Fess U.', city:'Tanger', stars:5, title:'Introuvable ailleurs',
    body:"Belle chaussure, très légère, cuir véritable. Jamais trouvé pareille qualité. Rapport qualité-prix imbattable. Félicitations !", date:'28 mai 2026' },
]

const ACCORDIONS = [
  { title:'Description & matières',
    body:"La Bottine Stéphano est fabriquée en cuir naturel pleine fleur, disponible en Noir, Marron et Gris ardoise. Style Chelsea Brogue avec semelle en gomme généreuse. Chaque paire est cousue à la main — cuir véritable, sans synthétique." },
  { title:'Entretien & longévité',
    body:"• Nettoyez avec un chiffon légèrement humide\n• Crème nourrissante pour cuir toutes les 6 semaines\n• Embauchoir en bois pour conserver la forme\n• Durée de vie estimée : 5 à 10 ans avec entretien" },
  { title:'Livraison & retours',
    body:"Délai de livraison :\n• Casablanca, Rabat : 24–48h\n• Marrakech, Fès, Tanger : 2–3 jours\n• Autres villes : 3–4 jours ouvrables\n\nRetours : 14 jours, sans condition." },
  { title:'Dimensions & composition',
    body:"• Dessus : cuir naturel pleine fleur 100%\n• Semelle : caoutchouc naturel\n• Doublure : cuir naturel souple\n• Style : Chelsea Brogue\n• Tailles disponibles : EU 39 à 44" },
]

const FAQS = [
  ['Comment choisir ma pointure ?',
   "Nos bottines taillent normalement. Si vous hésitez entre deux tailles, prenez la plus grande. Le cuir naturel s'assouplit et s'adapte à votre pied."],
  ['Puis-je payer à la livraison ?',
   'Oui ! Le paiement à la livraison (cash) est disponible partout au Maroc, sans frais supplémentaires.'],
  ['Le cuir est-il vraiment naturel ?',
   'Absolument. 100% cuir pleine fleur. Aucun cuir synthétique, aucun chrome.'],
  ['Et si la pointure ne me convient pas ?',
   'Retour gratuit sous 14 jours, aucune question posée. Contactez-nous sur WhatsApp.'],
]

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap');
:root{--sand:#F2EDE4;--cream:#FAF7F2;--leather:#8B5E3C;--leather-d:#5C3D20;--ink:#1A1410;--terra:#C4602A;--gray:#8A7D72;--gray-lt:#C8BDB5;--green:#3D7A4F;--green-bg:#EBF5EE;}
.tf{font-family:'Inter',sans-serif;background:var(--cream);color:var(--ink);font-size:15px;line-height:1.6;max-width:480px;margin:0 auto;padding-bottom:120px;}
.tf-promo{background:var(--leather);color:var(--cream);font-size:12.5px;font-weight:500;text-align:center;padding:9px 16px;letter-spacing:.3px;}
.tf-promo strong{color:#FFE0C4;}
.tf-nav{background:var(--cream);border-bottom:1px solid #E5DDD5;display:flex;align-items:center;justify-content:space-between;padding:14px 18px;position:sticky;top:0;z-index:100;}
.tf-logo{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--leather-d);letter-spacing:.5px;cursor:pointer;border:none;background:none;}
.tf-logo span{color:var(--terra);}
.tf-bc{padding:10px 18px;font-size:12px;color:var(--gray);display:flex;gap:6px;align-items:center;}
.tf-gallery{position:relative;background:var(--sand);}
.tf-hero{width:100%;aspect-ratio:1;overflow:hidden;position:relative;}
.tf-hero img{width:100%;height:100%;object-fit:cover;object-position:center;display:block;}
.tf-badge-a{position:absolute;top:14px;left:14px;background:var(--leather-d);color:var(--cream);font-size:10.5px;font-weight:600;padding:5px 11px;border-radius:20px;letter-spacing:.5px;z-index:2;}
.tf-badge-p{position:absolute;top:14px;right:14px;background:var(--terra);color:#fff;font-size:11px;font-weight:700;padding:5px 11px;border-radius:20px;z-index:2;}
.tf-dots{display:flex;justify-content:center;gap:6px;padding:10px 0 14px;}
.tf-dot{width:6px;height:6px;border-radius:50%;background:var(--gray-lt);cursor:pointer;transition:background .2s,transform .2s;}
.tf-dot.on{background:var(--leather);transform:scale(1.4);}
.tf-thumbs{display:flex;gap:8px;padding:0 18px 16px;overflow-x:auto;scrollbar-width:none;}
.tf-thumbs::-webkit-scrollbar{display:none;}
.tf-thumb{flex-shrink:0;width:64px;height:64px;border-radius:8px;overflow:hidden;border:2px solid transparent;cursor:pointer;transition:border-color .2s;}
.tf-thumb.on{border-color:var(--leather);}
.tf-thumb img{width:100%;height:100%;object-fit:cover;display:block;}
.tf-info{padding:4px 18px 0;}
.tf-brand-stars{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;}
.tf-brand{font-size:11px;font-weight:600;letter-spacing:1.5px;color:var(--leather);text-transform:uppercase;}
.tf-stars{color:#D4A017;font-size:13px;letter-spacing:-1px;}
.tf-starslink{font-size:12px;color:var(--gray);border:none;background:none;font-family:'Inter',sans-serif;cursor:pointer;text-decoration:underline;}
.tf-title{font-family:'Playfair Display',serif;font-size:26px;font-weight:700;line-height:1.2;color:var(--ink);margin-bottom:14px;}
.tf-title em{font-style:italic;color:var(--leather);}
.tf-price{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-bottom:8px;}
.tf-pnow{font-size:32px;font-weight:700;color:var(--ink);font-family:'Playfair Display',serif;}
.tf-pcur{font-size:18px;font-weight:400;}
.tf-pold{font-size:18px;color:var(--gray);text-decoration:line-through;}
.tf-psave{background:#FFF0E8;color:var(--terra);font-size:12px;font-weight:700;padding:3px 10px;border-radius:20px;border:1px solid #F5C9AE;}
.tf-ship{display:flex;align-items:center;gap:6px;font-size:13px;color:var(--green);font-weight:500;margin-bottom:20px;}
.tf-varlbl{font-size:12.5px;font-weight:600;color:var(--gray);margin-bottom:10px;letter-spacing:.3px;}
.tf-varlbl span{color:var(--ink);}
.tf-swatches{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:18px;}
.tf-swatch{width:38px;height:38px;border-radius:50%;cursor:pointer;border:3px solid transparent;outline:2px solid transparent;outline-offset:2px;transition:all .2s;}
.tf-swatch.on{border-color:#fff;outline-color:var(--leather);}
.tf-swatch:hover{transform:scale(1.1);}
.tf-sizes{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;}
.tf-sz{width:52px;height:44px;border:1.5px solid var(--gray-lt);border-radius:8px;background:#fff;font-size:14px;font-weight:500;color:var(--ink);cursor:pointer;transition:all .2s;font-family:'Inter',sans-serif;}
.tf-sz.on{border-color:var(--leather);background:var(--leather);color:#fff;}
.tf-sz:hover:not(.on){border-color:var(--leather);color:var(--leather);}
.tf-benef{list-style:none;margin-bottom:20px;}
.tf-benef li{display:flex;align-items:flex-start;gap:10px;padding:9px 0;border-bottom:1px solid #EDE5DC;font-size:14px;line-height:1.5;}
.tf-benef li:last-child{border-bottom:none;}
.tf-bi{font-size:17px;flex-shrink:0;margin-top:1px;}
.tf-bt strong{color:var(--ink);font-weight:600;display:block;font-size:13.5px;}
.tf-bt span{color:var(--gray);font-size:12.5px;}
.tf-scare{background:#FFF8F4;border:1px solid #F5C9AE;border-radius:12px;padding:12px 14px;margin-bottom:18px;display:flex;align-items:center;gap:10px;}
.tf-scare p{font-size:13px;line-height:1.5;flex:1;}
.tf-scare strong{color:var(--terra);}
.tf-bar-track{height:5px;background:#EDD5C5;border-radius:3px;overflow:hidden;margin-top:6px;}
.tf-bar-fill{height:100%;width:76%;background:linear-gradient(90deg,var(--terra),#E8824A);border-radius:3px;}
.tf-cta{margin-bottom:16px;display:flex;flex-direction:column;gap:10px;}
.tf-btn-p{background:var(--leather);color:#fff;border:none;border-radius:12px;padding:17px 24px;font-size:16px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;transition:background .2s;min-height:54px;}
.tf-btn-p:hover{background:var(--leather-d);}
.tf-btn-s{background:#fff;color:var(--ink);border:1.5px solid var(--gray-lt);border-radius:12px;padding:15px 24px;font-size:15px;font-weight:500;font-family:'Inter',sans-serif;cursor:pointer;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;transition:border-color .2s;min-height:50px;}
.tf-btn-s:hover{border-color:var(--leather);color:var(--leather);}
.tf-trust{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:24px;}
.tf-ti{background:#fff;border:1px solid #EDE5DC;border-radius:8px;padding:10px 12px;display:flex;align-items:center;gap:8px;font-size:12px;color:var(--gray);line-height:1.3;}
.tf-divider{border:none;border-top:6px solid var(--sand);margin:0 0 24px;}
.tf-below{padding:0 18px;}
.tf-sh{font-family:'Playfair Display',serif;font-size:20px;font-weight:700;color:var(--ink);margin-bottom:16px;display:flex;align-items:center;gap:8px;}
.tf-sh::after{content:'';flex:1;height:1px;background:#EDE5DC;}
.tf-acc{border-top:1px solid #EDE5DC;margin-bottom:24px;}
.tf-acc-item{border-bottom:1px solid #EDE5DC;}
.tf-acc-hd{display:flex;justify-content:space-between;align-items:center;padding:15px 0;cursor:pointer;font-size:14.5px;font-weight:500;color:var(--ink);}
.tf-acc-hd:hover{color:var(--leather);}
.tf-acc-icon{font-size:20px;color:var(--leather);transition:transform .2s;flex-shrink:0;}
.tf-acc-item.open .tf-acc-icon{transform:rotate(45deg);}
.tf-acc-body{font-size:13.5px;color:var(--gray);line-height:1.75;max-height:0;overflow:hidden;transition:max-height .3s,padding .3s;white-space:pre-line;}
.tf-acc-item.open .tf-acc-body{max-height:500px;padding-bottom:16px;}
.tf-rating{background:#fff;border:1px solid #EDE5DC;border-radius:12px;padding:18px;margin-bottom:14px;display:flex;gap:16px;align-items:center;}
.tf-rat-big .num{font-family:'Playfair Display',serif;font-size:52px;font-weight:700;color:var(--leather);line-height:1;}
.tf-rat-big .of{font-size:12px;color:var(--gray);margin-top:2px;}
.tf-rat-big .slg{color:#D4A017;font-size:16px;margin:4px 0;}
.tf-rat-bars{flex:1;}
.tf-rbar{display:flex;align-items:center;gap:8px;margin-bottom:5px;font-size:12px;color:var(--gray);}
.tf-rbar-lbl{width:40px;flex-shrink:0;}
.tf-rbar-track{flex:1;height:7px;background:#EDE5DC;border-radius:4px;overflow:hidden;}
.tf-rbar-fill{height:100%;background:#D4A017;border-radius:4px;}
.tf-rbar-pct{width:28px;text-align:right;flex-shrink:0;}
.tf-rv{background:#fff;border:1px solid #EDE5DC;border-radius:12px;padding:16px;margin-bottom:12px;}
.tf-rv-hd{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;}
.tf-rv-name{font-weight:600;font-size:14px;}
.tf-rv-loc{font-size:11.5px;color:var(--gray);margin-top:2px;}
.tf-rv-badge{background:var(--green-bg);color:var(--green);font-size:10.5px;font-weight:600;padding:3px 8px;border-radius:20px;flex-shrink:0;}
.tf-rv-stars{color:#D4A017;font-size:13px;margin-bottom:7px;}
.tf-rv-title{font-weight:600;font-size:14px;color:var(--ink);margin-bottom:6px;}
.tf-rv-body{font-size:13.5px;color:var(--gray);line-height:1.6;}
.tf-rv-date{font-size:11px;color:var(--gray-lt);margin-top:8px;}
.tf-form-box{background:#fff;border:1.5px solid #EDE5DC;border-radius:12px;padding:20px 16px;margin-bottom:16px;}
.tf-form-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:10px;}
.tf-form-lbl{font-size:11px;color:#999;display:block;margin-bottom:4px;}
.tf-input{width:100%;padding:11px 14px;border:1.5px solid #ddd;border-radius:8px;font-family:'Inter',sans-serif;font-size:14px;color:var(--ink);background:#fafafa;box-sizing:border-box;outline:none;transition:border-color .2s;}
.tf-input:focus{border-color:var(--leather);background:#fff;}
.tf-submit{width:100%;padding:15px;background:var(--leather);color:#fff;border:none;border-radius:12px;font-family:'Inter',sans-serif;font-size:16px;font-weight:600;cursor:pointer;transition:background .2s;margin-top:4px;}
.tf-submit:hover{background:var(--leather-d);}
.tf-submit:disabled{background:#ccc;cursor:not-allowed;}
.tf-err{background:#fef2f2;color:#c0392b;border-radius:8px;padding:9px 14px;font-size:12px;margin-bottom:12px;}
.tf-success{background:#f0fdf4;border:2px solid #86efac;border-radius:12px;padding:24px;text-align:center;margin-bottom:16px;}
.tf-sticky{position:fixed;bottom:0;left:50%;transform:translateX(-50%);width:100%;max-width:480px;background:var(--cream);border-top:1px solid #EDE5DC;padding:12px 18px 16px;z-index:200;box-shadow:0 -4px 20px rgba(26,20,16,.08);}
.tf-sticky-inner{display:flex;gap:12px;align-items:center;}
.tf-s-old{font-size:13px;color:var(--gray);text-decoration:line-through;display:block;}
.tf-s-now{font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--ink);}
.tf-sticky-btn{flex:1;background:var(--leather);color:#fff;border:none;border-radius:12px;padding:15px;font-size:15px;font-weight:600;font-family:'Inter',sans-serif;cursor:pointer;min-height:50px;}
.tf-sticky-btn:hover{background:var(--leather-d);}
.tf-footer{background:var(--sand);border-top:1px solid #EDE5DC;padding:24px 18px;text-align:center;font-size:12.5px;color:var(--gray);}
.tf-footer-logo{font-family:'Playfair Display',serif;font-size:18px;font-weight:700;color:var(--leather-d);margin-bottom:10px;}
.tf-wa{position:fixed;bottom:90px;left:18px;z-index:999;background:#25D366;border-radius:50%;width:52px;height:52px;display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 4px 20px rgba(37,211,102,.45);text-decoration:none;}
@media(max-width:480px){.tf-form-grid{grid-template-columns:1fr;}}
`

export default function ThemeFassi({ lang, onLangToggle, onAdmin }) {
  const [imgIdx,    setImgIdx]   = useState(0)
  const [color,     setColor]    = useState(0)
  const [size,      setSize]     = useState(null)
  const [showForm,  setShowForm] = useState(false)
  const [form,      setForm]     = useState({ nom:'', tel:'', adresse:'', ville:'' })
  const [error,     setError]    = useState('')
  const [loading,   setLoading]  = useState(false)
  const [success,   setSuccess]  = useState(null)
  const [sticky,    setSticky]   = useState(false)
  const [openAcc,   setOpenAcc]  = useState({ 0: true, faq0: true })

  useEffect(() => {
    const fn = () => setSticky(window.scrollY > 420)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const setF = k => e => setForm(f => ({ ...f, [k]: e.target.value }))
  const toggleAcc = k => setOpenAcc(a => ({ ...a, [k]: !a[k] }))

  const scrollToForm = () => {
    setShowForm(true)
    setTimeout(() => {
      const el = document.getElementById('tf-form')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const submit = async () => {
    if (!form.nom.trim())               return setError('Nom requis')
    if (!/^0[67]\d{8}$/.test(form.tel)) return setError('Numéro invalide (06XXXXXXXX)')
    if (!form.adresse.trim())           return setError('Adresse requise')
    if (!form.ville)                    return setError('Ville requise')
    setError(''); setLoading(true)
    try {
      const res = await createOrder({
        ...form,
        couleur: COLOR_DATA[color].name,
        taille:  size ? String(size) : '',
        produit: `Bottine Stéphano — ${COLOR_DATA[color].name}${size ? ' EU' + size : ''}`,
        prix:    P.prix,
        langue:  lang
      })
      setSuccess(res)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (e) {
      setError(e.message || 'Erreur réseau, réessayez')
    } finally {
      setLoading(false)
    }
  }

  const resetOrder = () => {
    setSuccess(null); setShowForm(false)
    setForm({ nom:'', tel:'', adresse:'', ville:'' }); setSize(null)
  }

  return (
    <>
      <style>{CSS}</style>
      <div className="tf">

        {/* PROMO BAR */}
        <div className="tf-promo">
          🚚 <strong>Livraison gratuite</strong> partout au Maroc · Paiement à la livraison disponible
        </div>

        {/* NAV */}
        <nav className="tf-nav">
          <button className="tf-logo" onClick={onAdmin}>FARIS<span>.</span></button>
          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <button onClick={onLangToggle}
              style={{ background:'none', border:'1px solid #ddd', borderRadius:6,
                padding:'4px 10px', fontSize:12, cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
              {lang === 'fr' ? 'العربية' : 'FR'}
            </button>
          </div>
        </nav>

        {/* BREADCRUMB */}
        <div className="tf-bc">
          <span style={{ cursor:'pointer', color:'var(--gray)' }}>Accueil</span>
          <span style={{ color:'var(--gray-lt)' }}>›</span>
          <span style={{ color:'var(--gray)' }}>Bottines</span>
          <span style={{ color:'var(--gray-lt)' }}>›</span>
          <span>Stéphano</span>
        </div>

        {/* GALLERY */}
        <div className="tf-gallery">
          <div className="tf-hero">
            <span className="tf-badge-a">✦ Cuir Naturel</span>
            <span className="tf-badge-p">−35%</span>
            <img src={IMGS[imgIdx]} alt="Bottine Stéphano" />
          </div>
          <div className="tf-dots">
            {IMGS.map((_, i) => (
              <div key={i} className={`tf-dot${i === imgIdx ? ' on' : ''}`} onClick={() => setImgIdx(i)} />
            ))}
          </div>
          <div className="tf-thumbs">
            {IMGS.map((src, i) => (
              <div key={i} className={`tf-thumb${i === imgIdx ? ' on' : ''}`} onClick={() => setImgIdx(i)}>
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </div>
        </div>

        {/* PRODUCT INFO */}
        <div className="tf-info">

          <div className="tf-brand-stars">
            <span className="tf-brand">Faris Atelier</span>
            <div style={{ display:'flex', alignItems:'center', gap:4 }}>
              <span className="tf-stars">★★★★★</span>
              <button className="tf-starslink">4.9 (89 avis)</button>
            </div>
          </div>

          <h1 className="tf-title">
            Bottine Stéphano —<br/>
            <em>Chelsea Brogue</em> Cuir Naturel
          </h1>

          <div className="tf-price">
            <span className="tf-pnow">{P.prix} <span className="tf-pcur">DH</span></span>
            <span className="tf-pold">{P.old} DH</span>
            <span className="tf-psave">Économisez {P.old - P.prix} DH</span>
          </div>
          <div className="tf-ship">✔ Livraison gratuite · Reçu en 2–3 jours ouvrables</div>

          {/* COLORS */}
          <div style={{ marginBottom:18 }}>
            <p className="tf-varlbl">Couleur : <span>{COLOR_DATA[color].name}</span></p>
            <div className="tf-swatches">
              {COLOR_DATA.map((c, i) => (
                <div key={i} title={c.name}
                  className={`tf-swatch${i === color ? ' on' : ''}`}
                  style={{ background: c.hex }}
                  onClick={() => setColor(i)} />
              ))}
            </div>
          </div>

          {/* SIZES */}
          <div style={{ marginBottom:18 }}>
            <p className="tf-varlbl">Pointure : <span>{size ? `EU ${size}` : 'Sélectionnez'}</span></p>
            <div className="tf-sizes">
              {SIZES.map(s => (
                <button key={s} className={`tf-sz${size === s ? ' on' : ''}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
            <span style={{ fontSize:12, color:'var(--leather)', textDecoration:'underline',
              cursor:'pointer', marginTop:8, display:'inline-block' }}>
              📏 Guide des tailles
            </span>
          </div>

          {/* BENEFITS */}
          <ul className="tf-benef">
            <li>
              <span className="tf-bi">🐄</span>
              <div className="tf-bt">
                <strong>100% cuir naturel · Tannage végétal</strong>
                <span>Cuir pleine fleur, sans produits chimiques ni chrome</span>
              </div>
            </li>
            <li>
              <span className="tf-bi">🧵</span>
              <div className="tf-bt">
                <strong>Cousu main · Style Chelsea Brogue</strong>
                <span>Semelle en gomme généreuse — confort dès le premier port</span>
              </div>
            </li>
            <li>
              <span className="tf-bi">🌱</span>
              <div className="tf-bt">
                <strong>S'assouplit avec le temps</strong>
                <span>Le cuir épouse la forme de votre pied progressivement</span>
              </div>
            </li>
          </ul>

          {/* SCARCITY */}
          <div className="tf-scare">
            <span style={{ fontSize:22 }}>🔥</span>
            <div style={{ flex:1 }}>
              <p><strong>Plus que 7 paires en stock</strong> dans cette couleur · 14 personnes regardent en ce moment</p>
              <div className="tf-bar-track"><div className="tf-bar-fill" /></div>
            </div>
          </div>

          {/* CTA / FORM / SUCCESS */}
          {success ? (
            <div className="tf-success">
              <div style={{ fontSize:48, marginBottom:10 }}>✅</div>
              <div style={{ fontSize:20, fontWeight:800, color:'#166534', marginBottom:6,
                fontFamily:'Playfair Display,serif' }}>
                Commande confirmée !
              </div>
              <div style={{ background:'#dcfce7', color:'#16a34a', display:'inline-block',
                padding:'4px 18px', borderRadius:50, fontSize:13, fontWeight:700, marginBottom:14 }}>
                Réf : {success.ref}
              </div>
              <p style={{ fontSize:13, color:'#555', lineHeight:1.8, marginBottom:16 }}>
                Notre équipe vous contactera dans les 24 heures pour confirmer la livraison.
              </p>
              <button onClick={resetOrder}
                style={{ background:'var(--leather)', color:'#fff', border:'none', borderRadius:10,
                  padding:'10px 28px', fontSize:13, fontWeight:700, cursor:'pointer',
                  fontFamily:'Inter,sans-serif' }}>
                Retour à la boutique
              </button>
            </div>
          ) : (
            <>
              {!showForm && (
                <div className="tf-cta">
                  <button className="tf-btn-p" onClick={scrollToForm}>
                    🛒 Commander maintenant — {P.prix} DH
                  </button>
                  <button className="tf-btn-s" onClick={scrollToForm}>
                    💵 Paiement à la livraison
                  </button>
                </div>
              )}

              {showForm && (
                <div className="tf-form-box" id="tf-form">
                  <div style={{ fontSize:14, fontWeight:700, color:'var(--ink)', marginBottom:14 }}>
                    📦 Informations de livraison
                  </div>
                  <div className="tf-form-grid">
                    <div>
                      <label className="tf-form-lbl">Nom complet *</label>
                      <input className="tf-input" placeholder="Mohamed Alami"
                        value={form.nom} onChange={setF('nom')} />
                    </div>
                    <div>
                      <label className="tf-form-lbl">Téléphone *</label>
                      <input className="tf-input" placeholder="06XXXXXXXX"
                        value={form.tel} onChange={setF('tel')} />
                    </div>
                  </div>
                  <div style={{ marginBottom:10 }}>
                    <label className="tf-form-lbl">Adresse complète *</label>
                    <input className="tf-input" placeholder="Rue, quartier, numéro"
                      value={form.adresse} onChange={setF('adresse')} />
                  </div>
                  <div style={{ marginBottom:14 }}>
                    <label className="tf-form-lbl">Ville *</label>
                    <select className="tf-input" value={form.ville} onChange={setF('ville')}
                      style={{ cursor:'pointer' }}>
                      <option value="">Sélectionnez une ville...</option>
                      {CITIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  {error && <div className="tf-err">⚠️ {error}</div>}
                  <button className="tf-submit" onClick={submit} disabled={loading}>
                    {loading ? 'Envoi en cours...' : `✔ Confirmer ma commande — ${P.prix} DH`}
                  </button>
                  <div style={{ textAlign:'center', fontSize:11, color:'#aaa', marginTop:8 }}>
                    🔒 Sécurisé · Paiement à la livraison · Retour 14 jours
                  </div>
                </div>
              )}
            </>
          )}

          {/* TRUST */}
          <div className="tf-trust">
            {[['🔒','Paiement','100% sécurisé'],['🔄','Retour gratuit','14 jours'],
              ['🇲🇦','Livraison','tout le Maroc'],['📞','Support','WhatsApp 24/7']].map(([icon,t,d]) => (
              <div key={t} className="tf-ti">
                <span style={{ fontSize:18 }}>{icon}</span>
                <span>{t}<br/><span style={{ fontSize:11 }}>{d}</span></span>
              </div>
            ))}
          </div>
        </div>

        <hr className="tf-divider" />

        {/* BELOW FOLD */}
        <div className="tf-below">

          {/* ACCORDIONS */}
          <div className="tf-sh">Détails du produit</div>
          <div className="tf-acc">
            {ACCORDIONS.map((a, i) => (
              <div key={i} className={`tf-acc-item${openAcc[i] ? ' open' : ''}`}>
                <div className="tf-acc-hd" onClick={() => toggleAcc(i)}>
                  {a.title}
                  <span className="tf-acc-icon">+</span>
                </div>
                <div className="tf-acc-body">{a.body}</div>
              </div>
            ))}
          </div>

          {/* REVIEWS */}
          <div className="tf-sh">Avis clients</div>
          <div className="tf-rating">
            <div className="tf-rat-big">
              <div className="num">4.9</div>
              <div className="slg">★★★★★</div>
              <div className="of">sur 5 · 89 avis</div>
            </div>
            <div className="tf-rat-bars">
              {[[5,'90%'],[4,'7%'],[3,'2%'],['≤2','1%']].map(([n, pct]) => (
                <div key={n} className="tf-rbar">
                  <span className="tf-rbar-lbl">{n} ★</span>
                  <div className="tf-rbar-track"><div className="tf-rbar-fill" style={{ width:pct }} /></div>
                  <span className="tf-rbar-pct">{pct}</span>
                </div>
              ))}
            </div>
          </div>

          {REVIEWS.map((r, i) => (
            <div key={i} className="tf-rv">
              <div className="tf-rv-hd">
                <div>
                  <div className="tf-rv-name">{r.name}</div>
                  <div className="tf-rv-loc">📍 {r.city}</div>
                </div>
                <span className="tf-rv-badge">✔ Achat vérifié</span>
              </div>
              <div className="tf-rv-stars">{'★'.repeat(r.stars)}</div>
              <div className="tf-rv-title">{r.title}</div>
              <div className="tf-rv-body">{r.body}</div>
              <div className="tf-rv-date">{r.date}</div>
            </div>
          ))}

          {/* FAQ */}
          <div className="tf-sh" style={{ marginTop:28 }}>Questions fréquentes</div>
          <div className="tf-acc">
            {FAQS.map(([q, a], i) => (
              <div key={`faq${i}`} className={`tf-acc-item${openAcc[`faq${i}`] ? ' open' : ''}`}>
                <div className="tf-acc-hd" onClick={() => toggleAcc(`faq${i}`)}>
                  {q}
                  <span className="tf-acc-icon">+</span>
                </div>
                <div className="tf-acc-body">{a}</div>
              </div>
            ))}
          </div>

        </div>

        {/* FOOTER */}
        <footer className="tf-footer">
          <div className="tf-footer-logo">FARIS.</div>
          <div>Artisanat authentique du Maroc</div>
          <div style={{ fontSize:22, margin:'10px 0', letterSpacing:4 }}>💳 💵 📱</div>
          <div>Visa · Mastercard · Paiement à la livraison</div>
          <div style={{ fontSize:11.5, color:'var(--gray-lt)', marginTop:6 }}>
            Casablanca · Rabat · Marrakech · Fès · Tanger · Agadir · et 40+ villes
          </div>
          <div style={{ marginTop:14, fontSize:11, color:'var(--gray-lt)' }}>
            © 2026 Faris Store — Tous droits réservés
          </div>
        </footer>

        {/* STICKY CTA */}
        {sticky && !success && (
          <div className="tf-sticky">
            <div className="tf-sticky-inner">
              <div>
                <span className="tf-s-old">{P.old} DH</span>
                <span className="tf-s-now">{P.prix} DH</span>
              </div>
              <button className="tf-sticky-btn" onClick={scrollToForm}>
                🛒 Commander maintenant
              </button>
            </div>
          </div>
        )}

        {/* WHATSAPP */}
        <a href="https://wa.me/212642499661" target="_blank" rel="noopener noreferrer" className="tf-wa">💬</a>

      </div>
    </>
  )
}
