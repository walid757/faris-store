import React, { useState, useEffect } from 'react'
import {
  adminLogin, getOrders, updateOrderStatus,
  blockIP, unblockIP, getBlockedIPs, getStats
} from '../api/client.js'

const AD = '#070c18'
const AB = '#0b1525'
const AB2 = '#1a2f4a'
const T = '#1d6475'

export default function AdminPage({ onBack }) {
  const [auth,    setAuth]    = useState(!!sessionStorage.getItem('faris_admin_token'))
  const [pass,    setPass]    = useState('')
  const [tab,     setTab]     = useState('orders')
  const [orders,  setOrders]  = useState([])
  const [blocked, setBlocked] = useState([])
  const [stats,   setStats]   = useState({})
  const [filter,  setFilter]  = useState('Tous')
  const [newIP,   setNewIP]   = useState('')
  const [toast,   setToast]   = useState('')
  const [loading, setLoading] = useState(false)

  const toast$ = (msg, dur = 2500) => { setToast(msg); setTimeout(() => setToast(''), dur) }

  // Load data
  const load = async () => {
    try {
      const [o, b, s] = await Promise.all([getOrders(), getBlockedIPs(), getStats()])
      if (Array.isArray(o)) setOrders(o)
      if (Array.isArray(b)) setBlocked(b)
      if (s.total !== undefined) setStats(s)
    } catch { toast$('Erreur de chargement') }
  }

  useEffect(() => { if (auth) load() }, [auth])

  const login = async () => {
    setLoading(true)
    const res = await adminLogin(pass)
    setLoading(false)
    if (res.token) setAuth(true)
    else toast$('Mot de passe incorrect ❌')
  }

  const logout = () => {
    sessionStorage.removeItem('faris_admin_token')
    setAuth(false)
  }

  const doBlockIP = async (ip, reason) => {
    await blockIP(ip, reason)
    toast$(`🚫 IP ${ip} bloqué`)
    load()
  }

  const doUnblockIP = async (ip) => {
    await unblockIP(ip)
    toast$(`✅ IP ${ip} débloqué`)
    load()
  }

  const doStatus = async (id, status) => {
    await updateOrderStatus(id, status)
    toast$('Statut mis à jour')
    load()
  }

  // ── LOGIN ──────────────────────────────────────────────────
  if (!auth) return (
    <div style={{ minHeight: '100vh', background: AD, display: 'flex',
      alignItems: 'center', justifyContent: 'center', fontFamily: 'Inter,sans-serif' }}>
      {toast && <div style={{ position: 'fixed', top: 20, left: '50%',
        transform: 'translateX(-50%)', background: '#7f1d1d', color: '#fca5a5',
        padding: '10px 22px', borderRadius: 8, zIndex: 9999 }}>{toast}</div>}
      <div style={{ background: AB, border: `1px solid ${AB2}`, borderRadius: 16,
        padding: '40px 32px', textAlign: 'center', maxWidth: 360, width: '100%' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>🛡️</div>
        <div style={{ fontSize: 22, fontWeight: 900, color: 'white', marginBottom: 4 }}>Faris Admin</div>
        <div style={{ fontSize: 12, color: '#475569', marginBottom: 24 }}>Espace sécurisé</div>
        <input value={pass} onChange={e => setPass(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && login()}
          type="password" placeholder="Mot de passe..."
          style={{ width: '100%', background: AD, border: `1px solid ${AB2}`, borderRadius: 10,
            padding: '12px 14px', color: 'white', fontFamily: 'Inter,sans-serif',
            fontSize: 14, outline: 'none', marginBottom: 12, boxSizing: 'border-box' }} />
        <button onClick={login} disabled={loading}
          style={{ width: '100%', padding: '12px', background: T, color: 'white', fontSize: 14,
            fontFamily: 'Inter,sans-serif', fontWeight: 700, border: 'none', cursor: 'pointer',
            borderRadius: 8, marginBottom: 10 }}>
          {loading ? '...' : 'CONNEXION'}
        </button>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#475569',
          fontSize: 13, cursor: 'pointer', fontFamily: 'Inter,sans-serif' }}>
          ← Retour au site
        </button>
      </div>
    </div>
  )

  const filteredOrders = filter === 'Tous' ? orders : orders.filter(o => o.status === filter)
  const statusColors = {
    'Nouveau': '#10b981', 'Suspect': '#f59e0b', 'Bloque': '#ef4444',
    'En cours': '#3b82f6', 'Livre': '#14b8a6', 'Annule': '#64748b'
  }

  // ── DASHBOARD ─────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: AD, fontFamily: 'Inter,sans-serif', color: '#e2e8f0' }}>
      {toast && <div style={{ position: 'fixed', top: 20, left: '50%',
        transform: 'translateX(-50%)', zIndex: 9999, background: '#052e16',
        border: '1px solid #10b981', borderRadius: 10, padding: '11px 22px',
        fontSize: 13, color: 'white', whiteSpace: 'nowrap' }}>{toast}</div>}

      {/* Header */}
      <div style={{ background: `linear-gradient(135deg,${AB},#0d1e38)`,
        borderBottom: `1px solid ${AB2}`, padding: '14px 18px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 38, height: 38, background: `linear-gradient(135deg,${T},#0d3d4a)`,
            borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            🛡️
          </div>
          <div>
            <div style={{ fontSize: 16, fontWeight: 900, color: 'white' }}>Faris Admin</div>
            <div style={{ fontSize: 11, color: '#475569' }}>Tableau de bord</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={load} style={{ background: AB, border: `1px solid ${AB2}`,
            borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>
            🔄 Rafraîchir
          </button>
          <button onClick={onBack} style={{ background: AB, border: `1px solid ${AB2}`,
            borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#94a3b8', cursor: 'pointer' }}>
            ← Site
          </button>
          <button onClick={logout} style={{ background: '#7f1d1d', border: '1px solid #ef4444',
            borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#fca5a5', cursor: 'pointer' }}>
            Déconnexion
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, padding: '14px 16px 0' }}>
        {[['📦', 'Commandes', stats.total || orders.length, '#3b82f6'],
          ['✨', 'Nouvelles', stats.nouveaux || orders.filter(o=>o.status==='Nouveau').length, '#10b981'],
          ['⚠️', 'Suspects',  orders.filter(o=>o.suspicious||o.status==='Suspect').length, '#f59e0b'],
          ['🚫', 'IPs bloq.', blocked.length, '#ef4444']
        ].map(([ic, lb, vl, cl]) => (
          <div key={lb} style={{ background: `linear-gradient(135deg,${AB},#0d1e38)`,
            border: `1px solid ${AB2}`, borderRadius: 12, padding: '14px', textAlign: 'center' }}>
            <div style={{ fontSize: 22 }}>{ic}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: cl, marginTop: 2 }}>{vl}</div>
            <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>{lb}</div>
          </div>
        ))}
      </div>

      {/* Revenue */}
      {stats.revenue > 0 && (
        <div style={{ margin: '10px 16px 0', background: AB, border: `1px solid ${AB2}`,
          borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center' }}>
          <span style={{ fontSize: 13, color: '#94a3b8' }}>💰 Chiffre d'affaires livré</span>
          <span style={{ fontSize: 18, fontWeight: 700, color: '#10b981' }}>{stats.revenue} MAD</span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, padding: '12px 16px 0', flexWrap: 'wrap' }}>
        {[['orders','📦 Commandes'],['ips','🚫 IPs bloqués'],['settings','⚙️ Paramètres']].map(([k,l]) => (
          <button key={k} onClick={() => setTab(k)}
            style={{ padding: '8px 14px', fontSize: 12, cursor: 'pointer',
              background: tab === k ? `linear-gradient(135deg,${T},#0d3d4a)` : 'transparent',
              color: tab === k ? 'white' : '#475569',
              border: tab === k ? `1px solid ${T}` : '1px solid transparent',
              borderRadius: 10, fontFamily: 'Inter,sans-serif', fontWeight: 600 }}>
            {l}
          </button>
        ))}
      </div>

      <div style={{ padding: '12px 16px 28px' }}>

        {/* ORDERS TAB */}
        {tab === 'orders' && (
          <div style={{ background: `linear-gradient(135deg,${AB},#0d1e38)`,
            border: `1px solid ${AB2}`, borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 8, padding: '10px 14px',
              borderBottom: `1px solid ${AB2}`, flexWrap: 'wrap' }}>
              {['Tous','Nouveau','Suspect','Bloque','En cours','Livre'].map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  style={{ padding: '5px 11px', fontSize: 11, cursor: 'pointer',
                    background: filter === f ? T : AB, color: filter === f ? 'white' : '#475569',
                    border: `1px solid ${filter === f ? T : AB2}`, borderRadius: 8,
                    fontFamily: 'Inter,sans-serif' }}>
                  {f}
                </button>
              ))}
              <span style={{ fontSize: 11, color: '#475569', alignSelf: 'center', marginLeft: 'auto' }}>
                {filteredOrders.length} commande(s)
              </span>
            </div>
            {filteredOrders.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#475569' }}>
                Aucune commande
              </div>
            ) : filteredOrders.map(o => {
              const isBlocked = blocked.find(b => b.ip === o.ip)
              const sc = statusColors[o.status] || '#94a3b8'
              return (
                <div key={o.id} style={{ padding: '13px 14px',
                  borderBottom: `1px solid #0d1a2a`,
                  background: o.suspicious ? 'rgba(239,68,68,.04)' : 'transparent' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700,
                        color: o.suspicious ? '#fca5a5' : 'white' }}>
                        {o.nom}
                        <span style={{ fontSize: 10, color: '#475569',
                          marginLeft: 8, fontWeight: 400 }}>
                          REF: {o.ref}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
                        📞 {o.tel} · 📍 {o.adresse}, {o.ville}
                      </div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 1 }}>
                        👟 {o.produit} {o.couleur} {o.taille ? `EU${o.taille}` : ''}
                      </div>
                      <div style={{ fontSize: 11, color: '#475569', marginTop: 1 }}>
                        🕐 {o.timeStr || o.time?.substring(0,19)}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: T }}>{o.prix} MAD</div>
                      <div style={{ fontSize: 10, fontFamily: 'monospace', color: isBlocked ? '#fca5a5' : '#64748b',
                        background: AB, border: `1px solid ${AB2}`, borderRadius: 6, padding: '2px 8px' }}>
                        {isBlocked ? '🚫 ' : ''}{o.ip}
                      </div>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 9px',
                        borderRadius: 6, background: sc + '20', color: sc }}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 7, marginTop: 9, flexWrap: 'wrap' }}>
                    {!isBlocked
                      ? <button onClick={() => doBlockIP(o.ip, 'Blocage depuis commande')}
                          style={{ padding: '5px 11px', fontSize: 11, background: '#450a0a',
                            color: '#fca5a5', border: '1px solid #ef4444', borderRadius: 8, cursor: 'pointer' }}>
                          🚫 Bloquer IP
                        </button>
                      : <button onClick={() => doUnblockIP(o.ip)}
                          style={{ padding: '5px 11px', fontSize: 11, background: '#052e16',
                            color: '#6ee7b7', border: '1px solid #10b981', borderRadius: 8, cursor: 'pointer' }}>
                          ✅ Débloquer
                        </button>
                    }
                    {['En cours','Livre','Annule'].map(s => (
                      <button key={s} onClick={() => doStatus(o.id, s)}
                        style={{ padding: '5px 11px', fontSize: 11, background: AB,
                          color: '#94a3b8', border: `1px solid ${AB2}`, borderRadius: 8, cursor: 'pointer' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* IPs TAB */}
        {tab === 'ips' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: `linear-gradient(135deg,${AB},#0d1e38)`,
              border: `1px solid ${AB2}`, borderRadius: 14, padding: 16 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 12 }}>
                Bloquer un IP manuellement
              </div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <input value={newIP} onChange={e => setNewIP(e.target.value)}
                  placeholder="ex: 185.220.101.12"
                  style={{ flex: 1, minWidth: 180, background: AD, border: `1px solid ${AB2}`,
                    borderRadius: 10, padding: '10px 14px', color: 'white',
                    fontFamily: 'monospace', fontSize: 13, outline: 'none' }} />
                <button onClick={() => { if (!newIP) return; doBlockIP(newIP, 'Manuel'); setNewIP('') }}
                  style={{ padding: '10px 18px', background: T, color: 'white',
                    fontSize: 13, border: 'none', borderRadius: 10, cursor: 'pointer',
                    fontFamily: 'Inter,sans-serif', fontWeight: 700 }}>
                  🚫 Bloquer
                </button>
              </div>
            </div>
            <div style={{ background: `linear-gradient(135deg,${AB},#0d1e38)`,
              border: `1px solid ${AB2}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ padding: '12px 14px', borderBottom: `1px solid ${AB2}`,
                fontSize: 14, fontWeight: 700, color: 'white' }}>
                IPs bloqués ({blocked.length})
              </div>
              {blocked.length === 0
                ? <div style={{ padding: 32, textAlign: 'center', color: '#475569' }}>Aucun IP bloqué</div>
                : blocked.map((b, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between', padding: '12px 14px',
                    borderBottom: `1px solid #0d1a2a`, flexWrap: 'wrap', gap: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 36, height: 36, background: '#450a0a',
                        border: '1px solid #ef4444', borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🚫</div>
                      <div>
                        <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#fca5a5', fontWeight: 700 }}>
                          {b.ip}
                        </div>
                        <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                          {b.reason} · {b.blockedAt?.substring(0,10)}
                        </div>
                      </div>
                    </div>
                    <button onClick={() => doUnblockIP(b.ip)}
                      style={{ padding: '6px 14px', fontSize: 12, background: '#052e16',
                        color: '#6ee7b7', border: '1px solid #10b981', borderRadius: 8, cursor: 'pointer' }}>
                      Lever le blocage
                    </button>
                  </div>
                ))
              }
            </div>
          </div>
        )}

        {/* SETTINGS TAB */}
        {tab === 'settings' && (
          <div style={{ background: `linear-gradient(135deg,${AB},#0d1e38)`,
            border: `1px solid ${AB2}`, borderRadius: 14, padding: 18 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 16 }}>
              Variables d'environnement Railway
            </div>
            {[
              ['ADMIN_PASSWORD', 'Mot de passe admin', 'faris2025'],
              ['WHATSAPP_NUMBER', 'Numéro WhatsApp (sans +)', '212600000000'],
              ['PORT', 'Port serveur', '5000'],
            ].map(([key, label, ex]) => (
              <div key={key} style={{ padding: '12px 14px', marginBottom: 8,
                background: AD, borderRadius: 10, border: `1px solid ${AB2}` }}>
                <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4, fontFamily: 'monospace' }}>
                  {key}
                </div>
                <div style={{ fontSize: 13, color: 'white', fontWeight: 600 }}>{label}</div>
                <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>
                  Exemple: <span style={{ fontFamily: 'monospace', color: '#64748b' }}>{ex}</span>
                </div>
              </div>
            ))}
            <div style={{ marginTop: 16, padding: '12px 14px', background: '#052e16',
              border: '1px solid #10b981', borderRadius: 10 }}>
              <div style={{ fontSize: 12, color: '#6ee7b7', fontWeight: 700, marginBottom: 4 }}>
                ✅ Statut du serveur
              </div>
              <div style={{ fontSize: 12, color: '#94a3b8' }}>
                API active · {orders.length} commandes · {blocked.length} IPs bloqués
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
