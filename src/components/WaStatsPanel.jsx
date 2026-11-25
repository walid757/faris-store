import React, { useState, useEffect } from 'react'

// ── WHATSAPP CLICKS per landing page (button / help card) ─────
const AD = '#070c18'
const AB = '#0b1525'
const AB2 = '#1a2f4a'
const G = '#25d366'

const token = () => sessionStorage.getItem('faris_admin_token') || ''
const btn = {
  padding: '6px 11px', fontSize: 11, cursor: 'pointer', background: AB, color: '#94a3b8',
  border: `1px solid ${AB2}`, borderRadius: 8, fontFamily: 'Inter,sans-serif', fontWeight: 600
}

export default function WaStatsPanel() {
  const [data, setData] = useState(null)
  const [err, setErr] = useState('')

  const load = () => {
    fetch('/api/admin/wa-stats', { headers: { 'x-admin-token': token() } })
      .then(r => r.ok ? r.json() : Promise.reject(r.status))
      .then(d => { setData(d); setErr('') })
      .catch(() => setErr('Erreur de chargement'))
  }
  useEffect(load, [])

  const reset = () => {
    if (!window.confirm('Remettre les clics WhatsApp à zéro ?')) return
    fetch('/api/admin/wa-stats/reset', { method: 'POST', headers: { 'x-admin-token': token() } })
      .then(load).catch(() => {})
  }

  const rows = Object.entries((data && data.pages) || {})
    .map(([page, p]) => ({ page, button: p.button || 0, help: p.help || 0, shown: p.helpShown || 0 }))
    .sort((a, b) => (b.button + b.help) - (a.button + a.help))
  const tot = rows.reduce((s, r) => ({ button: s.button + r.button, help: s.help + r.help, shown: s.shown + r.shown }), { button: 0, help: 0, shown: 0 })

  const th = { padding: '8px 6px', fontSize: 10, color: '#64748b', fontWeight: 700, textAlign: 'left', borderBottom: `1px solid ${AB2}` }
  const td = { padding: '8px 6px', fontSize: 12, color: 'white', borderBottom: `1px solid ${AB2}` }

  return (
    <div style={{ background: AB, border: `1px solid ${AB2}`, borderRadius: 14, padding: 14, fontFamily: 'Inter,sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
        <div>
          <div style={{ color: 'white', fontWeight: 800, fontSize: 15 }}>💬 WhatsApp — 0710827264</div>
          <div style={{ color: '#64748b', fontSize: 11, marginTop: 2 }}>
            Depuis {data && data.since ? new Date(data.since).toLocaleString('fr-FR') : '—'}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button style={btn} onClick={load}>↻ Actualiser</button>
          <button style={btn} onClick={reset}>Remise à zéro</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginTop: 12 }}>
        {[['Clics bouton', tot.button], ['Aide affichée (25s / erreurs)', tot.shown], ['Clics aide', tot.help]].map(([l, v]) => (
          <div key={l} style={{ background: AD, border: `1px solid ${AB2}`, borderRadius: 10, padding: '10px 12px' }}>
            <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>{l}</div>
            <div style={{ fontSize: 18, color: G, fontWeight: 800, marginTop: 2 }}>{v}</div>
          </div>
        ))}
      </div>

      {err && <div style={{ color: '#f87171', fontSize: 12, marginTop: 10 }}>{err}</div>}

      <div style={{ overflowX: 'auto', marginTop: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr>
            <th style={th}>Page</th><th style={th}>Clics bouton</th><th style={th}>Aide affichée</th><th style={th}>Clics aide</th>
          </tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td style={{ ...td, color: '#64748b' }} colSpan={4}>Aucun clic pour le moment</td></tr>}
            {rows.map(r => (
              <tr key={r.page}>
                <td style={td}>{r.page}</td><td style={td}>{r.button}</td><td style={td}>{r.shown}</td><td style={td}>{r.help}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
