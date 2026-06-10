# Handoff: LOAM CO — Colour Theme Inversion

## Overview
LOAM CO (loamco.co.uk) is a Shopify storefront for a UK mountain bike clothing brand.
The task is **one change only: invert the background/foreground colours** across the entire Shopify theme.
**Do not change any copy, layout, structure, functionality, images, or animations.**

## Live site
**URL:** https://www.loamco.co.uk/

Read the live site (and all linked pages below) directly — it is publicly accessible.
The uploaded file `loamco-home.html` is a saved copy of the homepage for reference if needed.

## The colour change — exact spec

| Token | Current (live site) | New value |
|---|---|---|
| Background | `#0A0A0A` (near-black) | `#FFFFFF` (white) |
| Frosted nav bg | `rgba(10,10,10,0.92)` | `rgba(255,255,255,0.92)` |
| Body text / headings | `#FFFFFF` | `#0A0A0A` |
| Secondary text (`--loam-ash`) | `#9A9A9A` | unchanged |
| Muted text (`--loam-graphite`) | `#5A5A5A` | unchanged |
| **Accent (`--loam-neon`)** | `#DAEE01` | **unchanged — keep exactly as-is** |
| Borders | `#2E2E2E` (charcoal) | `#2E2E2E` (unchanged — subtle on white) |
| Card / elevated surfaces | `#1A1A1A` | `#F0F0F0` |
| Icon / SVG stroke | `#FFFFFF` | `#0A0A0A` |
| Neon-bg sections (marquee, newsletter CTA) | keep neon bg `#DAEE01` with `#0A0A0A` text | unchanged |

### Summary rule
> **Swap black ↔ white. Leave neon (#DAEE01) and all greys exactly as they are.**

## Where colours live in the Shopify theme

The live site uses a custom Shopify theme. Colours are set in:
- `config/settings_data.json` — theme editor colour settings
- `assets/theme.css` (or equivalent) — CSS custom properties, likely `:root { --color-background: ...; --color-foreground: ...; }`
- Any inline `style=` attributes in `.liquid` template files that hardcode `#0A0A0A` or `#1A1A1A`

### Steps for Claude Code
1. **Connect to the Shopify store** (ask the user for Shopify CLI credentials / Partner access / theme ID)
2. **Pull the theme** with `shopify theme pull`
3. **Find all colour references** — search for `#0A0A0A`, `#1A1A1A`, `rgba(10,10,10`, `color: #fff`, `background: #fff` across all `.liquid`, `.css`, `.json` files
4. **Apply the swap** per the table above — be surgical, don't change neon or grey values
5. **Check each page** listed below after applying changes
6. **Push** with `shopify theme push --unpublished` to a preview theme first so the client can review before going live

## Pages to check after the change

| Page | URL |
|---|---|
| Home | https://www.loamco.co.uk/ |
| Shop — All | https://www.loamco.co.uk/collections/all |
| Shop — Casual | https://www.loamco.co.uk/collections/casual |
| Shop — Ride Wear | https://www.loamco.co.uk/collections/ride-wear |
| Product page | https://www.loamco.co.uk/products/loam-co-rake-ride-repeat |
| About | https://www.loamco.co.uk/pages/about |
| Contact | https://www.loamco.co.uk/pages/contact |
| Affiliate / Ambassadors | https://www.loamco.co.uk/pages/ambassadors |
| Blog | https://www.loamco.co.uk/blogs/blog |
| Crash Replacement | https://www.loamco.co.uk/pages/crash-replacement |
| Shipping | https://www.loamco.co.uk/pages/shipping |
| Returns | https://www.loamco.co.uk/pages/returns |
| Cart | https://www.loamco.co.uk/cart |

## Design reference files (in this folder)

| File | What it is |
|---|---|
| `README.md` | This document |
| `loamco-home.html` | Saved Shopify homepage HTML — use for structure/content reference |
| `colour-reference.html` | Visual reference: the homepage re-skinned in the new white theme |
| `tokens.css` | CSS custom properties for the new colour scheme, ready to drop in |

## Design tokens CSS (ready to use)

See `tokens.css` — these are the `:root` overrides. You can either:
- Drop them into the theme's main CSS file directly, or
- Map them to the Shopify `settings_data.json` colour fields

## Fidelity
**High-fidelity colour change only.** Every layout, font, spacing value, component, animation, and copy stays identical to the live site. Only the background/foreground colour values change per the table above.

## What NOT to change
- Any text / copy
- Any layout or spacing
- Any font families or sizes
- The neon accent `#DAEE01` — anywhere it appears
- Images, video, icons
- Animations (marquee, transitions)
- Shopify functionality (cart, checkout, product variants, etc.)
- The marquee section (dark background with neon text — keep as-is, it's intentional contrast)
- The newsletter CTA section (neon yellow background — keep as-is)
