import React, { useState, useEffect } from 'react'

// ── A/B TEST RESULTS — Stéphano landing pages (#lp/01..14) ────
const AD = '#070c18'
const AB = '#0b1525'
const AB2 = '#1a2f4a'
const T = '#1d6475'
const MIN_VISITS = 50 // below this, results are not reliable yet

const token = () => sessionStorage.getItem('faris_admin_token') || ''

const fmtTime = ms => {
  if (!ms && ms !== 0) return '—'
  const s = Math.round(ms / 1000)
  if (s < 60) return s + 's'
  const m = Math.floor(s / 60)
  if (m < 60) return m + 'm ' + String(s % 60).padStart(2, '0') + 's'
  return Math.floor(m / 60) + 'h ' + (m % 60) + 'm'
}
const pct = (a, b) => b ? (a / b * 100) : 0

export default function LpStatsPanel() {
  const [data, setData]     = useState(null)
  const [sort, setSort]     = useState('cr')
  const [copied, setCopied] = useState('')

  const load = () =>
    fetch('/api/admin/lp-stats', { headers: { 'x-admin-token': token() } })
      .then(r => r.json()).then(setData).catch(() => setData({ pages: {} }))

  useEffect(() => { load() }, [])

  const reset = async () => {
    if (!window.confirm('Remettre à zéro toutes les stats des landing pages ?')) return
    await fetch('/api/admin/lp-stats/reset', { method: 'POST', headers: { 'x-admin-token': token() } })
    load()
  }

  const copy = url => {
    try { navigator.clipboard.writeText(url); setCopied(url); setTimeout(() => setCopied(''), 1500) } catch {}
  }

  if (!data) return <div style={{ color: '#475569', fontSize: 13, padding: 20 }}>Chargement...</div>

  const ids = Array.from({ length: 14 }, (_, i) => String(i + 1).padStart(2, '0'))
  const rows = ids.map(id => {
    const p = (data.pages || {})[id] || {}
    const times = (p.times || []).slice().sort((a, b) => a - b)
    const median = times.length ? times[Math.floor(times.length / 2)] : null
    return {
      id,
      visits:  p.visits  || 0,
      forms:   p.forms   || 0,
      orders:  p.orders  || 0,
      pairs:   p.pairs   || 0,
      revenue: p.revenue || 0,
      cr:      pct(p.orders || 0, p.visits || 0),
      formRate: pct(p.forms || 0, p.visits || 0),
      median
    }
  })

  const sorters = {
    cr:     (a, b) => b.cr - a.cr || b.orders - a.orders,
    orders: (a, b) => b.orders - a.orders,
    fast:   (a, b) => (a.median ?? 1e15) - (b.median ?? 1e15),
    visits: (a, b) => b.visits - a.visits,
    id:     (a, b) => a.id.localeCompare(b.id)
  }
  const sorted = rows.slice().sort(sorters[sort])

  const reliable = rows.filter(r => r.visits >= MIN_VISITS)
  const best = reliable.slice().sort(sorters.cr)[0]
  const fastest = reliable.filter(r => r.median !== null).sort(sorters.fast)[0]

  const tot = rows.reduce((s, r) => ({ v: s.v + r.visits, o: s.o + r.orders, rev: s.rev + r.revenue }), { v: 0, o: 0, rev: 0 })
  const origin = window.location.origin

  const th = { padding: '8px 6px', fontSize: 10, color: '#64748b', textAlign: 'center', fontWeight: 700, whiteSpace: 'nowrap' }
  const td = { padding: '9px 6px', fontSize: 12, color: 'white', textAlign: 'center', borderTop: `1px solid ${AB2}`, whiteSpace: 'nowrap' }

  return (
    <div style={{ background: `linear-gradient(135deg,${AB},#0d1e38)`, border: `1px solid ${AB2}`, borderRadius: 14, padding: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>🧪 Test A/B — Stéphano (14 pages)</div>
        <button onClick={load} style={btn}>↻ Actualiser</button>
        <button onClick={reset} style={{ ...btn, marginLeft: 'auto', color: '#f87171', borderColor: '#7f1d1d' }}>Remise à zéro</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 8, marginBottom: 12 }}>
        <Card label="Visites totales" value={tot.v} />
        <Card label="Commandes" value={tot.o} sub={pct(tot.o, tot.v).toFixed(2) + '% conversion'} />
        <Card label="🏆 Meilleure conversion" value={best ? 'Page ' + best.id : '—'}
          sub={best ? best.cr.toFixed(2) + '% · ' + best.orders + ' cmd' : `min. ${MIN_VISITS} visites/page`} />
        <Card label="⚡ Conversion la + rapide" value={fastest ? 'Page ' + fastest.id : '—'}
          sub={fastest ? 'médiane ' + fmtTime(fastest.median) : `min. ${MIN_VISITS} visites/page`} />
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        {[['cr', 'Conversion %'], ['orders', 'Commandes'], ['fast', 'Rapidité'], ['visits', 'Visites'], ['id', 'N° page']].map(([k, l]) => (
          <button key={k} onClick={() => setSort(k)}
            style={{ ...btn, background: sort === k ? T : AB, color: sort === k ? 'white' : '#94a3b8' }}>
            Trier: {l}
          </button>
        ))}
      </div>

      <div style={{ overflowX: 'auto', background: AD, borderRadius: 10, border: `1px solid ${AB2}` }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Inter,sans-serif' }}>
          <thead>
            <tr>
              <th style={th}>Page</th><th style={th}>Visites</th><th style={th}>Ont vu le formulaire</th>
              <th style={th}>Commandes</th><th style={th}>Conversion</th><th style={th}>Temps médian → commande</th>
              <th style={th}>Paires</th><th style={th}>CA (MAD)</th><th style={th}>Lien pub</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(r => {
              const url = origin + '/#lp/' + r.id
              const win = best && r.id === best.id
              return (
                <tr key={r.id} style={{ background: win ? '#052e16' : 'transparent' }}>
                  <td style={{ ...td, fontWeight: 800 }}>
                    <a href={'#lp/' + r.id} target="_blank" rel="noreferrer" style={{ color: '#7dd3fc' }}>{r.id}</a>
                    {win && ' 🏆'}
                  </td>
                  <td style={td}>{r.visits}</td>
                  <td style={td}>{r.forms} <span style={{ color: '#64748b' }}>({r.formRate.toFixed(0)}%)</span></td>
                  <td style={{ ...td, fontWeight: 800 }}>{r.orders}</td>
                  <td style={{ ...td, fontWeight: 800, color: r.visits < MIN_VISITS ? '#64748b' : '#6ee7b7' }}>
                    {r.cr.toFixed(2)}%
                  </td>
                  <td style={td}>{fmtTime(r.median)}</td>
                  <td style={td}>{r.pairs}</td>
                  <td style={td}>{r.revenue}</td>
                  <td style={td}>
                    <button onClick={() => copy(url)} style={{ ...btn, padding: '3px 8px' }}>
                      {copied === url ? '✓ Copié' : 'Copier'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div style={{ fontSize: 11, color: '#64748b', marginTop: 10, lineHeight: 1.6 }}>
        Visite = 1 visiteur unique par session. Conversion = commandes ÷ visites.
        Les pages avec moins de {MIN_VISITS} visites sont en gris (pas encore fiables).
        Le temps est mesuré entre l'arrivée sur la page et la commande.
      </div>
    </div>
  )
}

const btn = {
  padding: '6px 11px', fontSize: 11, cursor: 'pointer', background: AB, color: '#94a3b8',
  border: `1px solid ${AB2}`, borderRadius: 8, fontFamily: 'Inter,sans-serif', fontWeight: 600
}

function Card({ label, value, sub }) {
  return (
    <div style={{ background: AD, border: `1px solid ${AB2}`, borderRadius: 10, padding: '10px 12px' }}>
      <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700 }}>{label}</div>
      <div style={{ fontSize: 18, color: 'white', fontWeight: 800, marginTop: 2 }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
    </div>
  )
}
