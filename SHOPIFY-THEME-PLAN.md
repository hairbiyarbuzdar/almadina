# Al-Madina → Shopify Theme — Build Plan

Goal: rebuild the Al-Madina storefront as a **custom Shopify (Liquid) theme**, matching
the current design and interactions, with Shopify providing the backend.

> Key reframe: a Shopify theme is **frontend only**. Shopify owns products, cart,
> **checkout**, orders, customers, search backend, and product-image hosting — so the
> entire current backend (`/dab` dashboard, Supabase, Prisma, cart-context, checkout,
> order actions, auth) is **not** rebuilt. We rebuild the look + interactions.

Path chosen: **Classic Liquid theme (Online Store 2.0)**, starting from **Dawn** and
restyling. (Alternative not taken: Hydrogen/headless React.)

---

## What carries over vs. what gets rebuilt

| Carries over (reuse) | Rebuilt / replaced |
|---|---|
| Visual design, layout, spacing | Components → Liquid sections/snippets |
| Tailwind classes / color tokens / fonts | React logic/hooks → Liquid + vanilla JS |
| Copy (Our Story, features, labels) | Cart/checkout/orders → Shopify |
| Product images & story photos | Data → Shopify products/collections/metafields |
| GSAP scroll effects (as vanilla) | Framer Motion effects → GSAP / Motion One |

---

## Phase 0 — Setup & tooling
- [ ] Create a **Shopify Partner account** + a **development store**.
- [ ] Install **Shopify CLI**; run `shopify theme init` (Dawn) → new theme repo (git).
- [ ] Set up a **Tailwind build** that compiles to `assets/theme.css` (watch + minified build).
- [ ] Add Cormorant Garamond + Inter (theme fonts or `assets/`), define color tokens.
- [ ] `shopify theme dev` live preview working.

## Phase 1 — Data in Shopify (no theme code)
- [ ] Store settings: currency **PKR**, timezone, store name.
- [ ] Create **products** (map the 12): title, description, price, compare-at price, images, inventory/stock, `active` status.
- [ ] Create **collections** for categories (Cleansers, Moisturizers, … = our categories).
- [ ] **Metafields** for product extras Shopify lacks natively: `benefits`, `ingredients`, `how_to_use`, `size`, `badge`, `rating` (+ metafield definitions).
- [ ] **Navigation** menus: main nav (Shop / Our Story / Contact) + mega-menu (categories, concerns, essentials).

## Phase 2 — Theme foundation
- [ ] `layout/theme.liquid` (head, global CSS/JS, header/footer includes).
- [ ] Global tokens + base styles (Tailwind compiled in).
- [ ] `config/settings_schema.json` scaffold (colors, fonts, announcement text, free-delivery threshold, WhatsApp/Easypaisa, socials).
- [ ] Announcement bar ("Free delivery over Rs 10,000") as a setting.

## Phase 3 — Header, footer, homepage sections
- [ ] **Header** section: logo, centered nav, mega-menu (from Navigation), search icon, **AJAX cart** icon w/ count — matching current spacing/alignment.
- [ ] **Hero** section (configurable image + heading + CTA).
- [ ] **Featured products** carousel (pull from a chosen collection).
- [ ] **Promo banners** section.
- [ ] **Features row** (free delivery / returns / support / payment).
- [ ] **"As seen in"** / testimonials section.
- [ ] **Footer** (columns + newsletter) with the **sticky-reveal** effect (CSS).

## Phase 4 — Collection (Shop) page
- [ ] `templates/collection.json` + product-grid section.
- [ ] **Product card** snippet (image, price, badge, rating, "View").
- [ ] **Category/faceted filters** (Shopify Storefront `filters`) + active state.
- [ ] **Pagination**.

## Phase 5 — Product page
- [ ] `templates/product.json`: gallery, title, price, variant/inventory, **product form (add to cart)**.
- [ ] Metafield sections: **What it's used for** (benefits), **How to use**, **Key ingredients**, size.
- [ ] **Related products**.

## Phase 6 — Cart & content
- [ ] **AJAX cart drawer** (Shopify Cart API): line items, qty, remove, subtotal, checkout button.
- [ ] Checkout = **Shopify's** (no build); light branding only.
- [ ] **Search** (Shopify predictive search) → overlay UI.
- [ ] **Our Story** page (custom page + section, real 1998 copy, stores).
- [ ] **Contact** page (Shopify contact form + Quetta/Hub Chowki + WhatsApp/Easypaisa).

## Phase 7 — Interactions / animations (vanilla JS / GSAP)
- [ ] Reveal-on-scroll (GSAP ScrollTrigger) + stat count-ups.
- [ ] **Fly-to-cart** (vanilla clone + spring via GSAP/Motion One).
- [ ] **Filter transitions** on the collection grid (Motion One / FLIP).
- [ ] **Footer reveal** (CSS, already framework-agnostic).
- [ ] **Page transition**: Liquid is multi-page (full reloads) — implement an exit/entry overlay ("curtain") that plays on link-click + during load, instead of the SPA version.

## Phase 8 — Payments, QA, launch
- [ ] **Payments**: install a **COD** app; add third-party gateway if wanted (⚠️ Shopify Payments unavailable in Pakistan).
- [ ] Keep the **Easypaisa + WhatsApp screenshot** flow (COD/manual) + WhatsApp order confirm links.
- [ ] `shopify theme check`, Lighthouse, responsive QA, accessibility.
- [ ] Connect **domain**; place test orders end-to-end.
- [ ] Go live.

---

## Key decisions & risks
- **Metafields** are how we keep benefits/ingredients/how-to-use/size/rating on products.
- **Framer Motion doesn't port** — those effects are re-done in vanilla JS/GSAP/Motion One.
- **Page transitions** work differently in a multi-page Liquid theme (no client router).
- **Pakistan payments**: COD + third-party gateway; no native Shopify Payments.
- **Monthly cost** for Shopify (the current custom store is free-tier on Supabase + Vercel).

## Suggested execution order
Phase 0 → 1 (get data in) → 2 → 3 (see the homepage) → 4 → 5 → 6 → 7 → 8.
Each phase is reviewable before moving on.
