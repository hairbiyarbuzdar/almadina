# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Skincare and cosmetics shoppers in Pakistan. Two overlapping groups:
- Existing customers of the physical Al-Madina stores (Quetta, Hub Chowki) who now also order online for convenience.
- Online shoppers anywhere in Pakistan — delivery is nationwide, not limited to the two store cities.

## Product Purpose

Al-Madina sells clean, curated skincare and cosmetics online and through two physical stores, with cash-on-delivery or Easypaisa (manual transfer + WhatsApp confirmation) as the payment paths. Success is a trusted, low-friction way for both loyal in-store customers and new nationwide customers to buy the same curated catalog.

## Positioning

25+ years of hand-picked, clean and cruelty-free skincare/cosmetics curation, trusted across generations of customers — started as a single counter in Quetta in 1998 by founder Haji Murtaza. The differentiator is trusted curation and a personal, family-business relationship (including in-store consultation), not the widest catalog or lowest price.

## Operating Context

- Two physical stores: Quetta (Churi Gali) and Hub Chowki (Lasi Road), Mon–Sat 11am–9pm. These remain the only physical locations; only delivery reach is nationwide.
- Checkout supports Cash on Delivery or Easypaisa online transfer; Easypaisa orders are confirmed by the customer sending a payment screenshot via WhatsApp. Shopify Payments is not available in Pakistan, which is why COD/manual-transfer-plus-WhatsApp is the payment model rather than an integrated gateway.
- Admin/back-office at `/dab`: manages products, categories, and orders against the Postgres database (Prisma + Supabase).
- Currency is PKR throughout (e.g. "Rs 4,200").

## Capabilities and Constraints

- Live product catalog is served from Postgres via Prisma (`app/lib/data.ts`); `app/lib/products.ts`'s `PRODUCTS` array is legacy/seed data and type definitions, not the source of truth for what's shown to shoppers.
- Cart is client-side (React context), checkout writes orders (with line-item price/name snapshots) via a server action, and stock decrements on order placement.
- A prior plan to rebuild the storefront as a Shopify Liquid theme (`SHOPIFY-THEME-PLAN.md`) is **shelved** — confirmed by the user. The Next.js + Prisma/Supabase stack is the durable product; that plan doc is stale and should not steer future work.
- No stated accessibility standard beyond ordinary web best practice.

## Brand Commitments

- Name: Al-Madina. Est. 1998, Quetta. Founder: Haji Murtaza.
- Real, factual brand history and copy already exist in `app/our-story/page.tsx` (timeline, stats, founder quote) — treat as evidence, not placeholder copy to rewrite casually.

## Evidence on Hand

- Product catalog (12+ real products across Cleansers, Moisturizers, Serums & Oils, Masks, Sunscreen, Toners, Eye Care) with real names, prices (PKR), descriptions, benefits, ingredients, and how-to-use copy — seeded in `prisma/seed.ts` / `app/lib/products.ts`, served live from Postgres.
- Real store addresses, hours, and contact channels (phone, WhatsApp, email) in `app/contact/page.tsx` and `app/lib/store-config.ts`.
- Real founder/heritage narrative and timeline in `app/our-story/page.tsx`. No fabricated testimonials, press, or case studies exist — do not invent any.

## Product Principles

1. Curation over catalog breadth — the brand's value is "hand-picked and trusted," not "everything available."
2. Low-friction ordering for a COD/manual-transfer market — no assumption of card-on-file or an integrated payment gateway.
3. One catalog, two front doors — in-store and online customers get the same trusted products; don't design as if online-only.
4. Heritage and personal trust (25+ years, founder-led, in-store consultation) are real differentiators to keep visible, not generic trust badges.
