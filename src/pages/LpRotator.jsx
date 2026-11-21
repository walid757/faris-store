import React, { useEffect } from 'react'

// ── ONE LINK FOR ALL PAGES (#test) ────────────────────────────
// Sends each visitor to one active landing page (#lp/XX).
// The server picks the page with the fewest visitors so the split is even.
// A returning visitor always gets the same page while it stays active.

const KEY = 'lp_assigned'
const store = {
  get: () => { try { return localStorage.getItem(KEY) } catch { return null } },
  set: v => { try { localStorage.setItem(KEY, v) } catch {} }
}

const go = lp => {
  window.history.replaceState(null, '', window.location.pathname + window.location.search + '#lp/' + lp)
  window.dispatchEvent(new HashChangeEvent('hashchange'))
}

export default function LpRotator() {
  useEffect(() => {
    const saved = store.get()
    fetch('/api/lp/next' + (saved ? '?keep=' + saved : ''))
      .then(r => r.json())
      .then(({ lp }) => { store.set(lp); go(lp) })
      .catch(() => {
        const lp = saved || String(Math.floor(Math.random() * 14) + 1).padStart(2, '0')
        store.set(lp)
        go(lp)
      })
  }, [])

  return <div style={{ minHeight: '100vh', background: '#000' }} />
}
