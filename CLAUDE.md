# STRICT RULES — ALWAYS FOLLOW

## THE GOLDEN RULE
When adding anything new: ADD ONLY. Never remove or modify existing code.

## FORBIDDEN — NO EXCEPTIONS:
- Do NOT delete any line
- Do NOT rewrite existing functions
- Do NOT refactor or "clean up" old code
- Do NOT modify anything I didn't ask about

## HOW TO ADD NEW FEATURES:
- Append new functions at the bottom of the file
- Add new cases inside existing if/switch WITHOUT changing other cases

## IF YOU ARE UNSURE:
Ask me what to add and where — then add ONLY there.

## AUTOMATIC RULE:
At the END of every session, automatically update the 
PROJECT MEMORY section in this file with:
- What was tried and failed
- What worked
- Current project status

## PROJECT MEMORY:
- Tried: Craftsman Unsplash image in HOOK 02 — failed (URL invalid, image broken). Reverted to prod.lifestyle[0].
- Worked: ThemeFassi.jsx (full Stéphano premium page), price animations (pulse/strike/badge/shake), Marron swatch cognac color (#8B5E3C), 3 color sliders (gray/brown/black, 6 photos each) with thumbnails + captions FR/AR.
- Status: Stéphano product page complete with HOOK sections + 3 color sliders. All 5 themes working (original/luxe/flash/story/fassi). Color sliders appear between HOOK 01 and HOOK 02, conditional on prod.colorSliders field.

## TESTING RULE:
Before any change, verify existing functionality still works.
Never remove existing tests.

## CHANGELOG RULE:
After every change, add one line to CHANGELOG.md:
- Date + what was added/changed

## SECURITY RULE:
Never write API keys or passwords directly in code.
Always use process.env variables.
Never log sensitive user data.

## CODE STYLE RULE:
Follow the exact same style as existing code.
If code is minified, keep it minified.
If code is normal, keep it normal.
Never reformat existing code.

## DEPENDENCIES RULE:
Never install a new npm package without asking me first.- Session 2026-11-20 — Worked: A/B test with 14 Stéphano landing pages (#lp/01..14), images resized from Desktop folder "Stephano 10 pages produit" to 1440px q90 (user wants HIGH quality on phone), admin tab "🧪 Test A/B" ranks pages by conversion % and median time to order. Tried: headless Chrome at 390px shows cropped page (Chrome min width), not a real bug — test at 560px. Status: built locally, NOT yet pushed/deployed to Railway.
- Update 2026-11-20 late — Status: A/B pages DEPLOYED and live at https://faris-store-production.up.railway.app/#lp/01..14 (Railway was paused for unpaid bill; after payment, auto-deploy missed the push — fixed with an empty commit to retrigger). Admin tab "🧪 Test A/B" live.
- 2026-11-21 — Worked: one link https://faris-store-production.up.railway.app/#test rotates visitors over active LP pages (balanced by server "assigned" counter, data/lp_active.json), time-on-page metric. User wants to explain plan FIRST, then code (rejected edits when I coded before explaining).

- 2026-11-21 later — Worked & LIVE: dark/gold sticky offer banner with animated 🔥 both sides ("عرض محدود ابتداءً من اليوم [today]"), wording "حذاء واحد بـ330 بدل 490 · جوج أحذية بـ590", city = free text, typing Casa/Casablanca/الدار البيضاء shows required district list (30 + حي آخر). Facebook link stays https://faris-store-production.up.railway.app/#test. Deploys take ~3-5 min after push.
- 2026-11-21 — Removed 3 test orders via admin remove endpoint; LP stats corrected, visits kept. Real LP orders so far: LP01, LP07, LP10. Open item: admin auth hardening (discussed with user, not decided yet).
- 2026-11-22 — LIVE: GS099 A/B test, 7 AR + 7 FR pages (only Desktop folders Arabe/ and Français/, NOT "ancienne version avec logo"), links #gs-ar and #gs-fr, price 429 / 690 (no strike price), colors Noir/Marron, sizes 39-44 (default, user did not confirm), admin tab "Test GS099". Stephano: phone accepts any 06/07 format, form-error tracking per field.
- 2026-11-22 later — GS099: top banner = gold scrolling ticker without prices (free delivery · COD · open parcel); price now 449 / 730 DH (saving 168). Stephano unchanged (330/590, flame banner).
- 2026-11-23 — GS099 price now 619 / 990 DH (saving 248). User sometimes says GS096/GS093/JS092 but means GS099 (only model with campaign pages). Stephano campaign paused (12 orders / 396 visits; best pages 05, 09, 13); proposed plan (keep 05/09/13, add InitiateCheckout pixel, reset stats, retargeting) awaiting user decision.
- 2026-11-23 — Stephano landing price now 420 (old 490) / 670 (old 980), saving 170. Pages 11-14 images still show 330/590 — asked user to replace images or turn pages off.
- 2026-11-23 later — GS099 price reverted to 429 / 690 DH (saving 168).
