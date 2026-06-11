const BASE = '/api'

// ── ORDERS ────────────────────────────────────────────────────
export const createOrder = async (data) => {
  const r = await fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return r.json()
}

// ── ADMIN ─────────────────────────────────────────────────────
let adminToken = sessionStorage.getItem('faris_admin_token') || ''

export const adminLogin = async (password) => {
  const r = await fetch(`${BASE}/admin/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  })
  const data = await r.json()
  if (data.token) {
    adminToken = data.token
    sessionStorage.setItem('faris_admin_token', adminToken)
  }
  return data
}

export const adminHeaders = () => ({ 'x-admin-token': adminToken })

export const getOrders = () =>
  fetch(`${BASE}/admin/orders`, { headers: adminHeaders() }).then(r => r.json())

export const updateOrderStatus = (id, status) =>
  fetch(`${BASE}/admin/orders/${id}`, {
    method: 'PATCH',
    headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(r => r.json())

export const blockIP = (ip, reason) =>
  fetch(`${BASE}/admin/block`, {
    method: 'POST',
    headers: { ...adminHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify({ ip, reason })
  }).then(r => r.json())

export const unblockIP = (ip) =>
  fetch(`${BASE}/admin/block/${ip}`, {
    method: 'DELETE',
    headers: adminHeaders()
  }).then(r => r.json())

export const getBlockedIPs = () =>
  fetch(`${BASE}/admin/blocked`, { headers: adminHeaders() }).then(r => r.json())

export const getStats = () =>
  fetch(`${BASE}/admin/stats`, { headers: adminHeaders() }).then(r => r.json())

// ── FACEBOOK PIXEL ────────────────────────────────────────────
export const fbPixel = (event, data = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, data)
  }
}
