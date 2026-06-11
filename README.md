# 🥿 Faris Store — Guide de déploiement

## Stack technique
- **Frontend** : React + Vite
- **Backend** : Node.js + Express
- **Hébergement** : Railway
- **Données** : JSON files (ou MongoDB si besoin)

---

## 🚀 Déploiement sur Railway

### 1. Préparer le projet

```bash
# Installer les dépendances
npm install

# Tester en local
npm run dev
# Frontend → http://localhost:3000
# API → http://localhost:5000
```

### 2. Build de production

```bash
npm run build
# Génère le dossier dist/
```

### 3. Pousser sur GitHub

```bash
git init
git add .
git commit -m "Faris Store v1.0"
git remote add origin https://github.com/TON_USER/faris-store.git
git push -u origin main
```

### 4. Déployer sur Railway

1. Aller sur **railway.app**
2. **New Project → Deploy from GitHub**
3. Sélectionner le repo `faris-store`
4. Railway détecte automatiquement `railway.toml`

### 5. Variables d'environnement Railway

Dans Railway → Settings → Variables :

| Variable | Valeur |
|----------|--------|
| `ADMIN_PASSWORD` | ton_mot_de_passe_fort |
| `WHATSAPP_NUMBER` | 212600000000 |
| `NODE_ENV` | production |

### 6. Domaine personnalisé

Dans Railway → Settings → Domains :
- Ajouter `www.faris.ma` ou ton domaine
- Configurer le DNS chez ton registrar

---

## 🔐 Accès Admin

- **URL** : `ton-site.up.railway.app/#admin`
- **Accès secret** : Cliquer 5 fois sur le logo "Faris"
- **Mot de passe** : Défini dans `ADMIN_PASSWORD`

---

## 📦 Structure des fichiers

```
faris-store/
├── server.js          ← API Express (commandes, admin, IP)
├── data/              ← Données (orders.json, blocked_ips.json)
├── dist/              ← Build React (généré par npm run build)
├── src/
│   ├── App.jsx        ← Router principal
│   ├── pages/
│   │   ├── HomePage.jsx    ← Page d'accueil + catalogue
│   │   ├── ProductPage.jsx ← Page produit (Rbati, etc.)
│   │   └── AdminPage.jsx   ← Dashboard admin
│   ├── components/
│   │   └── Shared.jsx      ← Marquee, Header, OrderForm...
│   ├── data/
│   │   ├── products.js     ← Catalogue des produits
│   │   └── translations.js ← FR / AR
│   └── api/
│       └── client.js       ← Appels API
└── railway.toml       ← Config déploiement
```

---

## 📱 Facebook Pixel

Dans `index.html`, remplacer `YOUR_PIXEL_ID` par ton vrai Pixel ID.

Les événements trackés automatiquement :
- `PageView` — à chaque changement de page
- `ViewContent` — à l'ouverture d'une page produit
- `Purchase` — à la confirmation de commande

---

## 🔗 Intégration WhatsApp Bot (optionnel)

Dans `server.js`, à la réception d'une commande, le serveur génère
un lien WhatsApp. Pour envoyer automatiquement via l'API WhatsApp :

```js
// Dans server.js, après writeJSON(FILES.orders, orders)
// Appeler l'endpoint de ton bot Railway :
await fetch('https://TON-BOT.up.railway.app/new-order', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(order)
})
```

---

## 📊 Meilleures pratiques

### Ajouter un produit
Dans `src/data/products.js`, ajouter un objet dans `PRODUCTS` avec :
- `slug` unique (ex: `"derby"`)
- `imgs` : tableau d'URLs Unsplash ou tes propres images
- `couleurs`, `tailles`, `prix`

### Changer les images
Remplacer les URLs Unsplash dans `products.js` par tes vraies photos :
```js
imgs: ['/images/rbati-1.jpg', '/images/rbati-2.jpg']
```
Et placer les images dans `public/images/`.

---

**Version**: 1.0.0 | **Auteur**: Faris © 2025
