# CHANGELOG

## 2026-06-29
- Added 3 color-specific image sliders to Stéphano product page: Gris ardoise (6 photos), Marron (6 photos), Noir (6 photos) with style captions in FR/AR
- Added `colorSliders` field to Stéphano product in products.js
- Copied 18 categorized boot images to public/products/stephano/gray/, brown/, black/
- Added `colorSlides` state and color slider section in ProductPage.jsx (between HOOK 01 and HOOK 02)

## 2026-11-20
- Added A/B test for Stéphano: 14 landing pages at #lp/01..#lp/14 (src/pages/LandingStephano.jsx), images in public/products/stephano/lp/ (1440px, q90), offer 330 MAD / 590 MAD for 2 pairs, tracking (visits, form views, orders, time to order) via /api/lp/event + data/lp_stats.json, and admin tab "🧪 Test A/B" (src/components/LpStatsPanel.jsx)
- 2026-11-21: Added single Facebook link #test (src/pages/LpRotator.jsx) that splits visitors evenly across active Stéphano pages (same visitor keeps same page), time-on-page tracking (/api/lp/stay), admin toggles to activate/deactivate pages + "Temps moyen sur la page" column
- 2026-11-21: Stéphano landing pages: red sticky banner "عرض محدود ابتداءً من اليوم [date]" (330 instead of 490, 2 pairs 590), old prices struck in offers, city is now a free text field, typing Casa/Casablanca/الدار البيضاء shows a required district list (30 districts + other)
- 2026-11-21: Offer banner restyled to match landing pages (dark + gold), animated flickering 🔥 on both sides, soft gold shine
