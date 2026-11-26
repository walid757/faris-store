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
- 2026-11-22: Landing pages form: phone accepted in any 06/07 format (+212, 00212, spaces, dashes, Arabic digits) and normalized to 0XXXXXXXXX; error shown next to the blocking field with red border + scroll; form errors counted per field per page (/api/lp/formerror) and shown in admin Test A/B (column "Erreurs formulaire")
- 2026-11-22: Added GS099 landing pages A/B test: 7 Arabic (#gs/ar/01..07) + 7 French (#gs/fr/01..07) from Desktop folders Arabe/Français only (1440px q90), one link per language (#gs-ar, #gs-fr), offer 429 DH / 2 for 690 DH, colors Noir/Marron, sizes 39-44, campaign tracking /api/lp2/* (data/lp2_stats.json), admin tab "🧪 Test GS099"
- 2026-11-22: GS099 landing pages (AR + FR): top banner replaced by a gold scrolling ticker without prices — free delivery · pay on delivery · open the parcel before paying (Stéphano banner unchanged)
- 2026-11-22: GS099 price changed to 449 DH (1 pair) / 730 DH (2 pairs), saving stays 168 DH; server LP2 revenue accepts new prices
- 2026-11-23: GS099 price changed to 619 DH (1 pair) / 990 DH (2 pairs), saving label 248 DH; server LP2 revenue accepts new prices
- 2026-11-23: Stéphano landing pages price changed to 420 DH (1 pair, old 490) / 670 DH (2 pairs, old 980), saving label 170 DH; banner reads prices from OFFERS; server LP revenue accepts new prices
- 2026-11-23: GS099 price reverted to 429 DH (1 pair) / 690 DH (2 pairs), saving label 168 DH
- 2026-11-24: Added GS099 new pages 24-11 A/B test: 4 Darija (DA1-4) + 4 Fousha (FU1-4) from Desktop folder "GS099 pages 24-11" (1440px q90), one link #gs099 rotating all 8 (#gsm/<id>), campaign gs099-mix, price 429 / 690, third table in admin tab "Test GS099"; existing #gs-ar / #gs-fr / #test unchanged
- 2026-11-25: Added TikTok Pixel 7692558098648547380 site-wide (index.html, PageView) + ttPixel helper in client.js; landing pages (Stéphano #test, GS099 #gs-ar/#gs-fr/#gs099) send ViewContent, InitiateCheckout (form reached), PlaceAnOrder + CompletePayment (order) with MAD value; Facebook Pixel unchanged
- 2026-11-25: WhatsApp 0710827264 — new number on all pages (replaces 0642499661), floating WhatsApp button + help card (after 25s in the form or 2 errors) on Stéphano/GS099 landing pages, admin tab "💬 WhatsApp" with clicks per page.
- 2026-11-26: A/B test models 26-11 — 8 models (GS101-GS107, GS0441), 4 pages each (DA1/DA2 Darija, FU1/FU2 Fousha), one link per model #gs101..#gs107 #gs0441, price 420 / 670, colors from the pages, admin tab "🧪 Test 26 Nov".
