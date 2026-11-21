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
- 2026-11-21: Stéphano landing pages wording: "حذاء واحد بـ330" and "جوج أحذية بـ590" in banner and order form (instead of زوج / جوج أزواج)
- 2026-11-21: Added admin endpoint POST /api/admin/orders/remove to delete test orders by ref and subtract them from LP stats (visits/clicks kept)
- 2026-11-21: Clean order product names — landing pages send "Stéphano Noir 42" (2 shoes: "Stéphano Noir 42 + Stéphano Marron 43"), no LP/x1/EU; removed "EU" before size in admin order list, Google Sheet and WhatsApp message; LP page of each order kept in LP stats (refs)
- 2026-11-21: Replaced Stéphano landing Page 13 images with the new version from the Desktop folder (1440px q90)
