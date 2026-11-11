# UI patterns

## Product variation controls — 2026-11-09

The variation editor and customer picker extend the existing product form and storefront styles.

| Property | Existing pattern used |
| --- | --- |
| Admin surfaces | `bg-white border border-black/10 rounded-lg p-4` |
| Inputs | `border border-black/15 rounded px-3 py-2.5 text-sm text-ink` |
| Primary text | `text-ink` |
| Supporting text | `text-sm text-ink-soft`, `text-xs text-ink-soft` |
| Primary action | `bg-ink text-white hover:bg-brand` |
| Selected option | `border-ink bg-cream text-ink` |
| Unselected option | `border-black/15 text-ink-soft hover:border-ink/50` |
| Keyboard focus | `focus-visible:outline-2 focus-visible:outline-brand`; label wrappers use `focus-within` |
| Touch controls | Minimum `min-h-11` for new option and editor buttons |
| Swatches | Named radio choices with an optional bordered circular color sample |

Files: `app/dab/(panel)/products/variant-editor.tsx`, `app/components/product-purchase.tsx`.

Shade labels always accompany colors. Sold-out options remain inspectable and explain why they cannot be added. Admin variation rows stack on phones and use two columns where space allows.

## Product photos — 2026-11-11

Files: `app/dab/(panel)/products/image-editor.tsx`, `app/components/product-gallery.tsx`.

| Property | Pattern |
| --- | --- |
| Preview surfaces | `bg-cream`, square cropped images |
| Admin photo rows | `border border-black/10 rounded p-2`, `gap-3` |
| Labels | `text-sm font-medium text-ink`; hints `text-xs text-ink-soft` |
| Actions | `text-xs` with underline and `min-h-11` |
| Gallery navigation | `min-h-11 px-3 text-sm text-ink border border-black/15 hover:border-ink` |
| Selected thumbnail | `border-2 border-ink`; unselected `border-transparent` |
| Keyboard focus | `focus-visible:outline-2 focus-visible:outline-brand` |

The cover remains the shop and cart image. Additional product photos are browsable below the main image. Thumbnails scroll horizontally within their container on phones. Selecting a variation starts its gallery at the shade image; browsing other photos does not change the chosen shade.
