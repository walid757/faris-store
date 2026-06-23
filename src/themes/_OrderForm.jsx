import React, { useState } from 'react'
import { COULEURS } from '../data/products.js'
import { createOrder } from '../api/client.js'

// Shared order form used by all themes
// S = style tokens: inputBg, borderColor, accentColor, textColor, mutedColor, btnBg, btnText, cardBg
export default function OrderForm({ product: P, lang, S = {} }) {
  const [f, setF] = useState({
    nom: '', tel: '', adresse: '', ville: '',
    couleur: P.couleurs[0] || '',
    taille: P.tailles[3] || P.tailles[0] || ''
  })
  const [err, setErr] = useState({})
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(null)

  const isAr = lang === 'ar'
  const dir = isAr ? 'rtl' : 'ltr'
  const font = isAr ? 'Tajawal, sans-serif' : 'Inter, sans-serif'

  const T = isAr ? {
    nom: 'الاسم الكامل', tel: 'رقم الهاتف', adresse: 'العنوان الكامل', ville: 'المدينة',
    color: 'اللون', size: 'المقاس (EU)',
    btn: `اطلب الآن — ${P.prix} درهم`,
    cod: 'الدفع عند الاستلام • توصيل 24-48 ساعة',
    success: 'تم تأكيد طلبك!', refLabel: 'رقم الطلب',
    contact: 'سنتصل بك قريباً لتأكيد التوصيل'
  } : {
    nom: 'Nom complet', tel: 'Téléphone (06 ou 07)', adresse: 'Adresse complète', ville: 'Ville',
    color: 'Couleur', size: 'Pointure (EU)',
    btn: `Commander — ${P.prix} MAD`,
    cod: 'Paiement à la livraison · Livraison 24-48h',
    success: 'Commande confirmée !', refLabel: 'Référence',
    contact: 'Nous vous contacterons pour confirmer la livraison'
  }

  const set = k => e => {
    const v = k === 'tel' ? e.target.value.replace(/\D/g,'').slice(0,10) : e.target.value
    setF(p => ({ ...p, [k]: v }))
    if (err[k]) setErr(p => ({ ...p, [k]: '' }))
  }

  const submit = async () => {
    const e = {}
    if (!f.nom.trim())                e.nom     = isAr ? 'مطلوب' : 'Requis'
    if (!/^0[67]\d{8}$/.test(f.tel)) e.tel     = isAr ? 'مثال: 0601234567' : 'Ex: 0601234567'
    if (!f.adresse.trim())            e.adresse = isAr ? 'مطلوب' : 'Requis'
    if (!f.ville.trim())              e.ville   = isAr ? 'مطلوب' : 'Requis'
    if (Object.keys(e).length) { setErr(e); return }

    setLoading(true)
    const res = await createOrder({
      ...f, produit: P.nom.fr, prix: P.prix, langue: lang
    }).catch(() => ({}))
    setLoading(false)

    if (res.success) setDone(res.ref)
    else setErr({ nom: res.error || (isAr ? 'خطأ في الخادم' : 'Erreur serveur') })
  }

  if (done) return (
    <div style={{ padding: '28px 20px', textAlign: 'center', direction: dir, fontFamily: font,
      background: S.cardBg || 'transparent' }}>
      <div style={{ fontSize: 44, marginBottom: 10 }}>✅</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: S.accentColor || '#10b981', marginBottom: 6 }}>
        {T.success}
      </div>
      <div style={{ fontSize: 13, color: S.mutedColor || '#666', marginBottom: 4 }}>
        {T.refLabel}: <strong style={{ color: S.textColor || '#111' }}>{done}</strong>
      </div>
      <div style={{ fontSize: 13, color: S.mutedColor || '#666', marginTop: 8 }}>{T.contact}</div>
    </div>
  )

  const inp = (k, type = 'text') => (
    <div key={k} style={{ marginBottom: 10 }}>
      <input
        type={type} placeholder={T[k]} value={f[k]} onChange={set(k)}
        style={{
          width: '100%', boxSizing: 'border-box', outline: 'none',
          background: S.inputBg || '#f9f9f9',
          border: `1.5px solid ${err[k] ? '#ef4444' : (S.borderColor || '#e0d6cc')}`,
          borderRadius: 10, padding: '13px 16px',
          color: S.textColor || '#111', fontSize: 14,
          fontFamily: font, direction: dir, transition: 'border-color .15s'
        }}
      />
      {err[k] && <div style={{ color:'#ef4444', fontSize:11, marginTop:3 }}>⚠ {err[k]}</div>}
    </div>
  )

  return (
    <div style={{ direction: dir, fontFamily: font }}>
      {inp('nom')}
      {inp('tel', 'tel')}
      {inp('adresse')}
      {inp('ville')}

      {P.couleurs.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, color: S.mutedColor || '#888', marginBottom: 6 }}>
            {T.color}: <span style={{ color: S.accentColor || '#a0714f', fontWeight: 600 }}>{f.couleur}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {P.couleurs.map(col => (
              <button key={col} onClick={() => setF(p => ({...p, couleur: col}))} title={col}
                style={{
                  width: 30, height: 30, borderRadius: '50%', background: COULEURS[col] || '#888',
                  border: `3px solid ${f.couleur === col ? (S.accentColor || '#a0714f') : 'transparent'}`,
                  cursor: 'pointer', outline: 'none', transition: 'border-color .15s',
                  boxShadow: f.couleur === col ? `0 0 0 2px ${S.inputBg || '#fff'} inset` : 'none'
                }} />
            ))}
          </div>
        </div>
      )}

      {P.tailles.length > 0 && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 12, color: S.mutedColor || '#888', marginBottom: 6 }}>{T.size}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {P.tailles.map(t => (
              <button key={t} onClick={() => setF(p => ({...p, taille: t}))}
                style={{
                  padding: '6px 12px', fontSize: 13,
                  background: f.taille === t ? (S.accentColor || '#a0714f') : 'transparent',
                  color: f.taille === t ? (S.btnText || 'white') : (S.textColor || '#111'),
                  border: `1.5px solid ${f.taille === t ? (S.accentColor||'#a0714f') : (S.borderColor||'#ddd')}`,
                  borderRadius: 8, cursor: 'pointer', fontFamily: font,
                  fontWeight: f.taille === t ? 700 : 400, transition: 'all .15s'
                }}>
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      <button onClick={submit} disabled={loading}
        style={{
          width: '100%', padding: '16px', marginTop: 4,
          background: loading ? (S.borderColor||'#ccc') : (S.btnBg || '#a0714f'),
          color: S.btnText || 'white', fontSize: 15, fontWeight: 900,
          border: 'none', borderRadius: 12, cursor: loading ? 'wait' : 'pointer',
          fontFamily: font, letterSpacing: 0.5, transition: 'all .2s'
        }}>
        {loading ? '...' : T.btn}
      </button>

      <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: S.mutedColor || '#888' }}>
        🛡️ {T.cod}
      </div>
    </div>
  )
}
