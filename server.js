require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
const rateLimit = require('express-rate-limit')
const { google } = require('googleapis')

const app = express()
const PORT = process.env.PORT || 5000
const WHATSAPP_NUMBER = process.env.WHATSAPP_NUMBER || '212600000000'
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
          [order.couleur, order.taille ? 'EU' + order.taille : ''].filter(Boolean).join(' '),
          'Confirmé'
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
  stats:   path.join(DATA_DIR, 'stats.json')
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

// ── MIDDLEWARE ───────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// Rate limiting: max 5 orders per hour per IP
const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: 'Trop de tentatives. Veuillez reessayer dans 1 heure.' }
})

// IP Blocking middleware
app.use('/api/orders', (req, res, next) => {
  const clientIP = req.ip || req.connection.remoteAddress
  const blocked = readJSON(FILES.blocked, [])
  if (blocked.find(b => b.ip === clientIP)) {
    return res.status(403).json({ error: 'Acces refuse', code: 403 })
  }
  next()
})

// ── ROUTES ───────────────────────────────────────────────────

// Ping
app.get('/api/ping', (req, res) => res.json({ status: 'ok', version: '1.0.0' }))


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
  if (!tel || !tel.startsWith('0') || tel.length !== 10 || !/^\d+$/.test(tel))
    return res.status(400).json({ field: 'tel', error: 'Numero invalide (0XXXXXXXXX)' })
  if (!adresse?.trim()) return res.status(400).json({ field: 'adresse', error: 'Adresse requise' })
  if (!ville?.trim())   return res.status(400).json({ field: 'ville', error: 'Ville requise' })

  const clientIP = req.ip || req.connection.remoteAddress

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
    `👟 ${order.produit} ${order.couleur} ${order.taille ? 'EU'+order.taille : ''}\n` +
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

// ── SERVE FRONTEND ────────────────────────────────────────────
const distPath = path.join(__dirname, 'dist')
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath))
  app.get('*', (req, res) => {
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
