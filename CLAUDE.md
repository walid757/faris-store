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
