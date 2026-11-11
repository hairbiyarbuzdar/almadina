# Product photos

In **Admin → Products → Add/Edit**, use **Product images → Add photos**. Select multiple photos together, or add more in another selection. The first photo is the cover used in the shop and cart.

- **Make cover** promotes a photo to the first position.
- **Move earlier** changes the order of additional photos.
- **Remove** removes a photo from the product when saved.
- Save before leaving the form. At least one photo is required.

Up to 12 photos are supported per product. Files can be JPG, PNG, WebP, AVIF, or GIF, up to 5 MB each and 15 MB combined per save, including variation uploads. Save photos in batches to add a larger gallery.

Customers browse photos using thumbnails or Previous/Next buttons. Phones also support horizontal swipes. Variation selection brings its image to the front without losing the product photos; browsing photos does not change the variation selected for purchase.

The additive migration `20261111000000_product_gallery` adds an empty list of additional images to existing products, preserving their current covers. Apply with `npx prisma migrate deploy` before releasing the app. Uploads use the existing Supabase product-images bucket. Removing a photo does not delete its stored file, so existing cart references and variation images remain valid. New uploads are cleaned up on a failed save where storage is available.

Run `npm test` for image validation, cart, and optional local database tests. `npm run test:e2e` runs desktop and mobile flows against the isolated local test database documented in `product-variations.md`, plus a local Supabase Storage protocol fixture. Store credentials and live image uploads are not used by those browser tests.
