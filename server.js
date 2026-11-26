require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const rateLimit = require('express-rate-limit')
const { google } = require('googleapis')

const app = express()
const PORT = process.env.PORT || 5000
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '212642499661'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'faris2025'

// ── GOOGLE SHEETS ────────────────────────────────────────────
const SHEET_ID = process.env.GOOGLE_SHEET_ID
const getGoogleCredentials = () => {
  if (process.env.GOOGLE_CREDENTIALS_BASE64) {
    return JSON.parse(Buffer.from(process.env.GOOGLE_CREDENTIALS_BASE64, 'base64').toString())
  }
  if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    }
  }
  return null
}
const appendToSheet = async (order) => {
  const creds = getGoogleCredentials()
  const sid   = process.env.GOOGLE_SHEET_ID
  if (!creds || !sid) {
    console.log('[SHEETS] Skipped - missing credentials or sheet ID')
    return
  }
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: creds,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    })
    const sheets = google.sheets({ version: 'v4', auth })
    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: 'Youcan-Orders!A1',
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[
          order.ref,
          order.nom,
          order.tel,
          order.adresse,
          order.prix,
          order.ville,
          order.produit,
          [order.couleur, order.taille || ''].filter(Boolean).join(' '),
          ''
        ]]
      }
    })
    console.log(`[SHEETS] Row added for ${order.ref}`)
  } catch (err) {
    console.error('[SHEETS] Error:', err.message)
  }
}

// ── DATA FILES ──────────────────────────────────────────────
const DATA_DIR = path.join(__dirname, 'data')
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR)

const FILES = {
  orders:  path.join(DATA_DIR, 'orders.json'),
  blocked: path.join(DATA_DIR, 'blocked_ips.json'),
  stats:   path.join(DATA_DIR, 'stats.json'),
  theme:   path.join(DATA_DIR, 'theme.json')
}

const readJSON = (file, def) => {
  try { return JSON.parse(fs.readFileSync(file, 'utf8')) }
  catch { return def }
}
const writeJSON = (file, data) => {
  fs.writeFileSync(file, JSON.stringify(data, null, 2))
}

// Init files
if (!fs.existsSync(FILES.orders))  writeJSON(FILES.orders,  [])
if (!fs.existsSync(FILES.blocked)) writeJSON(FILES.blocked, [])
if (!fs.existsSync(FILES.stats))   writeJSON(FILES.stats,   { visits: 0, orders: 0 })
if (!fs.existsSync(FILES.theme))   writeJSON(FILES.theme,   { active: 'original' })

// ── MIDDLEWARE ───────────────────────────────────────────────
app.set('trust proxy', 1)
app.use(cors())
app.use(express.json())

const getClientIP = (req) =>
  req.headers['x-forwarded-for']?.split(',')[0].trim() ||
  req.headers['x-real-ip'] ||
  req.ip ||
  req.connection.remoteAddress

// Rate limiting: max 5 orders per hour per IP
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives. Veuillez reessayer dans 1 heure.' }
})

// IP Blocking middleware
app.use('/api/orders', (req, res, next) => {
  const clientIP = getClientIP(req)
  const blocked = readJSON(FILES.blocked, [])
  if (blocked.find(b => b.ip === clientIP)) {
    return res.status(403).json({ error: 'Acces refuse', blocked: true })
  }
  next()
})

// ── ROUTES ───────────────────────────────────────────────────

// Ping
app.get('/api/ping', (req, res) => res.json({ status: 'ok', version: '1.0.0' }))

// Public config (whatsapp number + active theme for frontend)
app.get('/api/config', (req, res) => {
  const theme = readJSON(FILES.theme, { active: 'original' })
  res.json({ whatsapp: WHATSAPP_NUMBER, theme: theme.active })
})


// Stats (page view)
app.post('/api/stats/visit', (req, res) => {
  const stats = readJSON(FILES.stats, { visits: 0, orders: 0 })
  stats.visits++
  writeJSON(FILES.stats, stats)
  res.json({ ok: true })
})

// ── CREATE ORDER ─────────────────────────────────────────────
app.post('/api/orders', orderLimiter, (req, res) => {
  const { nom, tel, adresse, ville, produit, couleur, taille, prix, langue } = req.body

  // Validation
  if (!nom?.trim())    return res.status(400).json({ field: 'nom', error: 'Nom requis' })
  if (!tel || !/^0[67]\d{8}$/.test(tel))
    return res.status(400).json({ field: 'tel', error: 'Numero invalide (06XXXXXXXX ou 07XXXXXXXX)' })
  if (!adresse?.trim()) return res.status(400).json({ field: 'adresse', error: 'Adresse requise' })
  if (!ville?.trim())   return res.status(400).json({ field: 'ville', error: 'Ville requise' })


  const clientIP = getClientIP(req)

  const order = {
    id:       Date.now(),
    ref:      'FAR-' + Date.now().toString().slice(-6),
    nom:      nom.trim(),
    tel:      tel.trim(),
    adresse:  adresse.trim(),
    ville:    ville.trim(),
    produit:  produit || 'Rbati',
    couleur:  couleur || '',
    taille:   taille  || '',
    prix:     prix    || 890,
    langue:   langue  || 'fr',
    status:   'Nouveau',
    ip:       clientIP,
    attempts: 1,
    time:     new Date().toISOString(),
    timeStr:  new Date().toLocaleString('fr-MA', { timeZone: 'Africa/Casablanca' })
  }

  // Save order
  const orders = readJSON(FILES.orders, [])
  orders.unshift(order)
  writeJSON(FILES.orders, orders)

  // Update stats
  const stats = readJSON(FILES.stats, { visits: 0, orders: 0 })
  stats.orders++
  writeJSON(FILES.stats, stats)

  // WhatsApp notification (via WhatsApp Business API or link)
  const waMsg = encodeURIComponent(
    `🛒 *Nouvelle commande Faris*\n` +
    `📋 Ref: ${order.ref}\n` +
    `👤 ${order.nom}\n` +
    `📞 ${order.tel}\n` +
    `📍 ${order.adresse}, ${order.ville}\n` +
    `👟 ${order.produit} ${order.couleur} ${order.taille || ''}\n` +
    `💰 ${order.prix} MAD\n` +
    `🕐 ${order.timeStr}`
  )

  appendToSheet(order)

  console.log(`[ORDER] ${order.ref} - ${order.nom} - ${order.tel} - ${order.ville}`)
  console.log(`[WA] https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`)

  res.json({
    success: true,
    ref: order.ref,
    message: 'Commande confirmee',
    waLink: `https://wa.me/${WHATSAPP_NUMBER}?text=${waMsg}`
  })
})

// ── ADMIN AUTH ────────────────────────────────────────────────
app.post('/api/admin/auth', (req, res) => {
  const { password } = req.body
  if (password === ADMIN_PASSWORD) {
    res.json({ success: true, token: 'faris_admin_' + Date.now() })
  } else {
    res.status(401).json({ error: 'Mot de passe incorrect' })
  }
})

// Admin middleware
const adminAuth = (req, res, next) => {
  const token = req.headers['x-admin-token']
  if (!token || !token.startsWith('faris_admin_')) {
    return res.status(401).json({ error: 'Non autorise' })
  }
  next()
}

// Get all orders
app.get('/api/admin/orders', adminAuth, (req, res) => {
  const orders = readJSON(FILES.orders, [])
  res.json(orders)
})

// Update order status
app.patch('/api/admin/orders/:id', adminAuth, (req, res) => {
  const { status } = req.body
  const orders = readJSON(FILES.orders, [])
  const idx = orders.findIndex(o => o.id === parseInt(req.params.id))
  if (idx === -1) return res.status(404).json({ error: 'Commande introuvable' })
  orders[idx].status = status
  writeJSON(FILES.orders, orders)
  res.json({ success: true })
})

// Block IP
app.post('/api/admin/block', adminAuth, (req, res) => {
  const { ip, reason } = req.body
  const blocked = readJSON(FILES.blocked, [])
  if (blocked.find(b => b.ip === ip)) return res.json({ already: true })
  blocked.push({ ip, reason: reason || 'Blocage manuel', blockedAt: new Date().toISOString() })
  writeJSON(FILES.blocked, blocked)
  // Update order statuses for this IP
  const orders = readJSON(FILES.orders, [])
  orders.forEach(o => { if (o.ip === ip) o.status = 'Bloque' })
  writeJSON(FILES.orders, orders)
  res.json({ success: true })
})

// Unblock IP
app.delete('/api/admin/block/:ip', adminAuth, (req, res) => {
  const blocked = readJSON(FILES.blocked, []).filter(b => b.ip !== req.params.ip)
  writeJSON(FILES.blocked, blocked)
  res.json({ success: true })
})

// Get blocked IPs
app.get('/api/admin/blocked', adminAuth, (req, res) => {
  res.json(readJSON(FILES.blocked, []))
})

// Get/set active theme
app.get('/api/admin/theme', adminAuth, (req, res) => {
  res.json(readJSON(FILES.theme, { active: 'original' }))
})
app.post('/api/admin/theme', adminAuth, (req, res) => {
  const { active } = req.body
  const allowed = ['original', 'luxe', 'flash', 'story', 'fassi']
  if (!allowed.includes(active)) return res.status(400).json({ error: 'Thème invalide' })
  writeJSON(FILES.theme, { active })
  console.log(`[THEME] Active theme changed to: ${active}`)
  res.json({ success: true, active })
})

// Get stats
app.get('/api/admin/stats', adminAuth, (req, res) => {
  const orders = readJSON(FILES.orders, [])
  const stats  = readJSON(FILES.stats, { visits: 0, orders: 0 })
  res.json({
    ...stats,
    total:    orders.length,
    nouveaux: orders.filter(o => o.status === 'Nouveau').length,
    bloques:  readJSON(FILES.blocked, []).length,
    revenue:  orders.filter(o => o.status === 'Livre').reduce((s,o) => s + o.prix, 0)
  })
})

// ── LANDING PAGES A/B TEST (Stéphano #lp/01..14) ─────────────
const LP_FILE = path.join(DATA_DIR, 'lp_stats.json')
if (!fs.existsSync(LP_FILE)) writeJSON(LP_FILE, { since: new Date().toISOString(), pages: {} })
const LP_ID = /^(0[1-9]|1[0-4])$/

app.post('/api/lp/event', (req, res) => {
  const { lp, type, ms, qty, prix } = req.body || {}
  if (!LP_ID.test(String(lp)) || !['visit', 'form', 'order'].includes(type))
    return res.status(400).json({ error: 'invalid' })
  const data = readJSON(LP_FILE, { since: new Date().toISOString(), pages: {} })
  const p = data.pages[lp] || (data.pages[lp] = { visits: 0, forms: 0, orders: 0, pairs: 0, revenue: 0, times: [] })
  if (type === 'visit') p.visits++
  if (type === 'form')  p.forms++
  if (type === 'order') {
    p.orders++
    p.pairs   += Number(qty) === 2 ? 2 : 1
    p.revenue += [330, 590, 420, 670].includes(Number(prix)) ? Number(prix) : 0
    const t = Number(ms)
    if (t > 0 && t < 7 * 24 * 3600 * 1000) p.times.push(Math.round(t))
    if (req.body.ref) (p.refs = p.refs || []).push(String(req.body.ref).slice(0, 20))
  }
  writeJSON(LP_FILE, data)
  res.json({ ok: true })
})

app.get('/api/admin/lp-stats', adminAuth, (req, res) => {
  res.json(readJSON(LP_FILE, { pages: {} }))
})

app.post('/api/admin/lp-stats/reset', adminAuth, (req, res) => {
  writeJSON(LP_FILE, { since: new Date().toISOString(), pages: {} })
  console.log('[LP] Stats reset')
  res.json({ success: true })
})

// ── LP ROTATOR: one link (#test) splits visitors across active pages ──
const LP_ACTIVE_FILE = path.join(DATA_DIR, 'lp_active.json')
const ALL_LP = Array.from({ length: 14 }, (_, i) => String(i + 1).padStart(2, '0'))
if (!fs.existsSync(LP_ACTIVE_FILE)) writeJSON(LP_ACTIVE_FILE, { active: ALL_LP })
const newLpPage = () => ({ visits: 0, forms: 0, orders: 0, pairs: 0, revenue: 0, times: [] })

app.get('/api/lp/next', (req, res) => {
  const active = (readJSON(LP_ACTIVE_FILE, { active: ALL_LP }).active || []).filter(id => LP_ID.test(id))
  const pool = active.length ? active : ALL_LP
  // returning visitor keeps the same page while it is still active
  if (pool.includes(String(req.query.keep))) return res.json({ lp: String(req.query.keep) })
  const data = readJSON(LP_FILE, { since: new Date().toISOString(), pages: {} })
  const assigned = id => (data.pages[id] && data.pages[id].assigned) || 0
  const min = Math.min(...pool.map(assigned))
  const candidates = pool.filter(id => assigned(id) === min)
  const lp = candidates[Math.floor(Math.random() * candidates.length)]
  const p = data.pages[lp] || (data.pages[lp] = newLpPage())
  p.assigned = (p.assigned || 0) + 1
  writeJSON(LP_FILE, data)
  res.json({ lp })
})

// time spent on a page (sent when the visitor leaves / hides the page)
app.post('/api/lp/stay', express.text({ type: '*/*' }), (req, res) => {
  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  const { lp, ms, first } = body || {}
  const t = Math.round(Number(ms))
  if (!LP_ID.test(String(lp)) || !(t > 0)) return res.status(400).json({ error: 'invalid' })
  const data = readJSON(LP_FILE, { since: new Date().toISOString(), pages: {} })
  const p = data.pages[lp] || (data.pages[lp] = newLpPage())
  p.stay = (p.stay || 0) + Math.min(t, 30 * 60 * 1000)
  if (first) p.staySessions = (p.staySessions || 0) + 1
  writeJSON(LP_FILE, data)
  res.json({ ok: true })
})

app.get('/api/admin/lp-active', adminAuth, (req, res) => {
  res.json(readJSON(LP_ACTIVE_FILE, { active: ALL_LP }))
})

app.post('/api/admin/lp-active', adminAuth, (req, res) => {
  const pages = Array.isArray(req.body?.active) ? req.body.active.map(String).filter(id => LP_ID.test(id)) : null
  if (!pages || !pages.length) return res.status(400).json({ error: 'Au moins une page active' })
  const active = [...new Set(pages)].sort()
  writeJSON(LP_ACTIVE_FILE, { active })
  console.log(`[LP] Active pages: ${active.join(',')}`)
  res.json({ success: true, active })
})

// ── LP FORM ERRORS: which field blocks visitors (no customer data stored) ──
const LP_ERR_FIELDS = ['taille', 'nom', 'tel', 'ville', 'quartier', 'adresse', 'network',
  'server_nom', 'server_tel', 'server_adresse', 'server_ville', 'server_other']
app.post('/api/lp/formerror', (req, res) => {
  const lp = String(req.body?.lp || '')
  const field = String(req.body?.field || '').replace(/\d+$/, '')
  if (!LP_ID.test(lp) || !LP_ERR_FIELDS.includes(field)) return res.status(400).json({ error: 'invalid' })
  const data = readJSON(LP_FILE, { since: new Date().toISOString(), pages: {} })
  const p = data.pages[lp] || (data.pages[lp] = newLpPage())
  p.errors = p.errors || {}
  p.errors[field] = (p.errors[field] || 0) + 1
  writeJSON(LP_FILE, data)
  res.json({ ok: true })
})

// ── CAMPAIGN LANDING PAGES (lp2): GS099 Arabic / French ──────
// data/lp2_stats.json = { campaigns: { 'gs099-ar': { since, active: [...], pages: { '01': {...} } } } }
const LP2_FILE = path.join(DATA_DIR, 'lp2_stats.json')
const LP2_CAMPAIGNS = {
  'gs099-ar': ['01', '02', '03', '04', '05', '06', '07'],
  'gs099-fr': ['01', '02', '03', '04', '05', '06', '07'],
  'gs099-mix': ['DA1', 'DA2', 'DA3', 'DA4', 'FU1', 'FU2', 'FU3', 'FU4']
}
// models 26-11: 4 pages each (2 Darija + 2 Fousha), one link per model
;['gs101', 'gs102', 'gs103', 'gs104', 'gs105', 'gs106', 'gs107', 'gs0441'].forEach(m => {
  LP2_CAMPAIGNS['m26-' + m] = ['DA1', 'DA2', 'FU1', 'FU2']
})
if (!fs.existsSync(LP2_FILE)) writeJSON(LP2_FILE, { campaigns: {} })
const lp2Read = () => readJSON(LP2_FILE, { campaigns: {} })
const lp2Camp = (data, c) => {
  if (!data.campaigns) data.campaigns = {}
  return data.campaigns[c] || (data.campaigns[c] = { since: new Date().toISOString(), active: LP2_CAMPAIGNS[c].slice(), pages: {} })
}
const lp2Page = (camp, lp) => camp.pages[lp] || (camp.pages[lp] = newLpPage())
const lp2Valid = (c, lp) => !!LP2_CAMPAIGNS[c] && LP2_CAMPAIGNS[c].includes(String(lp))

app.post('/api/lp2/event', (req, res) => {
  const { c, lp, type, ms, qty, prix, ref } = req.body || {}
  if (!lp2Valid(c, lp) || !['visit', 'form', 'order'].includes(type)) return res.status(400).json({ error: 'invalid' })
  const data = lp2Read(); const p = lp2Page(lp2Camp(data, c), String(lp))
  if (type === 'visit') p.visits++
  if (type === 'form')  p.forms++
  if (type === 'order') {
    p.orders++
    p.pairs   += Number(qty) === 2 ? 2 : 1
    p.revenue += [429, 690, 449, 730, 619, 990, 420, 670].includes(Number(prix)) ? Number(prix) : 0
    const t = Number(ms)
    if (t > 0 && t < 7 * 24 * 3600 * 1000) p.times.push(Math.round(t))
    if (ref) (p.refs = p.refs || []).push(String(ref).slice(0, 20))
  }
  writeJSON(LP2_FILE, data)
  res.json({ ok: true })
})

app.post('/api/lp2/stay', (req, res) => {
  let body = req.body
  if (typeof body === 'string') { try { body = JSON.parse(body) } catch { body = {} } }
  const { c, lp, ms, first } = body || {}
  const t = Math.round(Number(ms))
  if (!lp2Valid(c, lp) || !(t > 0)) return res.status(400).json({ error: 'invalid' })
  const data = lp2Read(); const p = lp2Page(lp2Camp(data, c), String(lp))
  p.stay = (p.stay || 0) + Math.min(t, 30 * 60 * 1000)
  if (first) p.staySessions = (p.staySessions || 0) + 1
  writeJSON(LP2_FILE, data)
  res.json({ ok: true })
})

app.post('/api/lp2/formerror', (req, res) => {
  const c = String(req.body?.c || ''), lp = String(req.body?.lp || '')
  const field = String(req.body?.field || '').replace(/\d+$/, '')
  if (!lp2Valid(c, lp) || !LP_ERR_FIELDS.includes(field)) return res.status(400).json({ error: 'invalid' })
  const data = lp2Read(); const p = lp2Page(lp2Camp(data, c), lp)
  p.errors = p.errors || {}
  p.errors[field] = (p.errors[field] || 0) + 1
  writeJSON(LP2_FILE, data)
  res.json({ ok: true })
})

app.get('/api/lp2/next', (req, res) => {
  const c = String(req.query.c || '')
  if (!LP2_CAMPAIGNS[c]) return res.status(400).json({ error: 'invalid' })
  const data = lp2Read(); const camp = lp2Camp(data, c)
  const pool = (camp.active || []).filter(id => LP2_CAMPAIGNS[c].includes(id))
  const ids = pool.length ? pool : LP2_CAMPAIGNS[c]
  if (ids.includes(String(req.query.keep))) return res.json({ lp: String(req.query.keep) })
  const assigned = id => (camp.pages[id] && camp.pages[id].assigned) || 0
  const min = Math.min(...ids.map(assigned))
  const candidates = ids.filter(id => assigned(id) === min)
  const lp = candidates[Math.floor(Math.random() * candidates.length)]
  const p = lp2Page(camp, lp)
  p.assigned = (p.assigned || 0) + 1
  writeJSON(LP2_FILE, data)
  res.json({ lp })
})

app.get('/api/admin/lp2-stats', adminAuth, (req, res) => {
  const c = String(req.query.c || '')
  if (!LP2_CAMPAIGNS[c]) return res.status(400).json({ error: 'invalid' })
  const data = lp2Read(); const camp = lp2Camp(data, c)
  res.json({ ...camp, ids: LP2_CAMPAIGNS[c] })
})

app.post('/api/admin/lp2-active', adminAuth, (req, res) => {
  const c = String(req.body?.c || '')
  if (!LP2_CAMPAIGNS[c]) return res.status(400).json({ error: 'invalid' })
  const pages = Array.isArray(req.body?.active) ? req.body.active.map(String).filter(id => LP2_CAMPAIGNS[c].includes(id)) : []
  if (!pages.length) return res.status(400).json({ error: 'Au moins une page active' })
  const data = lp2Read(); const camp = lp2Camp(data, c)
  camp.active = [...new Set(pages)].sort()
  writeJSON(LP2_FILE, data)
  console.log(`[LP2] ${c} active pages: ${camp.active.join(',')}`)
  res.json({ success: true, active: camp.active })
})

app.post('/api/admin/lp2-stats/reset', adminAuth, (req, res) => {
  const c = String(req.body?.c || '')
  if (!LP2_CAMPAIGNS[c]) return res.status(400).json({ error: 'invalid' })
  const data = lp2Read(); const camp = lp2Camp(data, c)
  data.campaigns[c] = { since: new Date().toISOString(), active: camp.active, pages: {} }
  writeJSON(LP2_FILE, data)
  console.log(`[LP2] ${c} stats reset`)
  res.json({ success: true })
})

// ── REMOVE TEST ORDERS (by ref) + subtract them from LP stats ──
// body: { refs: ['FAR-xxxxxx'], lpTimes: { '07': [ms, ...] } }  (lpTimes optional)
app.post('/api/admin/orders/remove', adminAuth, (req, res) => {
  const refs = Array.isArray(req.body?.refs) ? req.body.refs.map(String) : []
  if (!refs.length) return res.status(400).json({ error: 'refs requis' })
  const orders = readJSON(FILES.orders, [])
  const removed = orders.filter(o => refs.includes(o.ref))
  writeJSON(FILES.orders, orders.filter(o => !refs.includes(o.ref)))

  const stats = readJSON(FILES.stats, { visits: 0, orders: 0 })
  stats.orders = Math.max(0, (stats.orders || 0) - removed.length)
  writeJSON(FILES.stats, stats)

  const data = readJSON(LP_FILE, { pages: {} })
  removed.forEach(o => {
    const m = /LP(\d{2}) x(\d)/.exec(o.produit || '')
    const lpId = m ? m[1] : Object.keys(data.pages).find(k => (data.pages[k].refs || []).includes(o.ref))
    if (!lpId || !data.pages[lpId]) return
    const qty = m ? Number(m[2]) : ([590, 670].includes(Number(o.prix)) ? 2 : 1)
    const p = data.pages[lpId]
    if (p.refs) p.refs = p.refs.filter(r => r !== o.ref)
    p.orders  = Math.max(0, (p.orders || 0) - 1)
    p.pairs   = Math.max(0, (p.pairs || 0) - (qty === 2 ? 2 : 1))
    p.revenue = Math.max(0, (p.revenue || 0) - (Number(o.prix) || 0))
  })
  const lpTimes = req.body?.lpTimes || {}
  Object.keys(lpTimes).forEach(lp => {
    const p = data.pages[lp]
    if (!p || !Array.isArray(p.times)) return
    ;(lpTimes[lp] || []).forEach(t => {
      const i = p.times.indexOf(Number(t))
      if (i !== -1) p.times.splice(i, 1)
    })
  })
  writeJSON(LP_FILE, data)

  // campaign pages (GS099...): find the page by ref and subtract the order
  const data2 = lp2Read()
  removed.forEach(o => {
    Object.values(data2.campaigns || {}).forEach(camp => {
      Object.values(camp.pages || {}).forEach(p => {
        if (!(p.refs || []).includes(o.ref)) return
        p.refs    = p.refs.filter(r => r !== o.ref)
        p.orders  = Math.max(0, (p.orders || 0) - 1)
        p.pairs   = Math.max(0, (p.pairs || 0) - ([690, 730, 990, 670].includes(Number(o.prix)) ? 2 : 1))
        p.revenue = Math.max(0, (p.revenue || 0) - (Number(o.prix) || 0))
      })
    })
  })
  writeJSON(LP2_FILE, data2)
  console.log(`[ORDERS] Removed test orders: ${removed.map(o => o.ref).join(', ')}`)
  res.json({ success: true, removed: removed.map(o => o.ref) })
})

// ── WHATSAPP CLICKS (landing pages) ───────────────────────────
// data/wa_clicks.json = { since, pages: { 'gs099-mix/DA1': { button, help, helpShown } } }
const WA_FILE = path.join(DATA_DIR, 'wa_clicks.json')
if (!fs.existsSync(WA_FILE)) writeJSON(WA_FILE, { since: new Date().toISOString(), pages: {} })
app.post('/api/wa/click', (req, res) => {
  const page = String(req.body?.page || '').replace(/[^a-zA-Z0-9/_-]/g, '').slice(0, 40)
  const type = String(req.body?.type || '')
  if (!page || !['button', 'help', 'helpShown'].includes(type)) return res.status(400).json({ error: 'invalid' })
  const data = readJSON(WA_FILE, { since: new Date().toISOString(), pages: {} })
  if (!data.pages) data.pages = {}
  const p = data.pages[page] || (data.pages[page] = { button: 0, help: 0, helpShown: 0 })
  p[type] = (p[type] || 0) + 1
  writeJSON(WA_FILE, data)
  res.json({ ok: true })
})
app.get('/api/admin/wa-stats', adminAuth, (req, res) => {
  res.json(readJSON(WA_FILE, { since: null, pages: {} }))
})
app.post('/api/admin/wa-stats/reset', adminAuth, (req, res) => {
  writeJSON(WA_FILE, { since: new Date().toISOString(), pages: {} })
  res.json({ ok: true })
})

// ── SERVE FRONTEND ────────────────────────────────────────────
const distPath = path.join(__dirname, 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, { etag: false, maxAge: 0 }))
  app.get('*', (req, res) => {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate')
    res.sendFile(path.join(distPath, 'index.html'))
  })
} else {
  app.get('/', (req, res) => res.json({ status: 'API running. Build frontend first.' }))
}

app.listen(PORT, () => {
  console.log(`\n🚀 Faris Store API running on port ${PORT}`)
  console.log(`📦 Orders: ${readJSON(FILES.orders, []).length} total`)
  console.log(`🛡️  Admin password: ${ADMIN_PASSWORD}\n`)
})

module.exports = app
