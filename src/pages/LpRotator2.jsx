import React, { useEffect } from 'react'

// ── ONE LINK PER CAMPAIGN (#gs-ar · #gs-fr) ──────────────────
// Sends each visitor to one active page of the campaign; the server picks
// the page with the fewest visitors. A returning visitor keeps the same page.

const store = {
  get: k => { try { return localStorage.getItem(k) } catch { return null } },
  set: (k, v) => { try { localStorage.setItem(k, v) } catch {} }
}

export default function LpRotator2({ campaign, base, ids }) {
  useEffect(() => {
    const KEY = 'lp2_assigned_' + campaign
    const go = lp => {
      window.history.replaceState(null, '', window.location.pathname + window.location.search + base + lp)
      window.dispatchEvent(new HashChangeEvent('hashchange'))
    }
    const saved = store.get(KEY)
    fetch('/api/lp2/next?c=' + campaign + (saved ? '&keep=' + saved : ''))
      .then(r => r.json())
      .then(({ lp }) => { if (!lp) throw new Error('no page'); store.set(KEY, lp); go(lp) })
      .catch(() => {
        const lp = saved || ids[Math.floor(Math.random() * ids.length)]
        store.set(KEY, lp)
        go(lp)
      })
  }, [campaign])

  return <div style={{ minHeight: '100vh', background: '#000' }} />
}
