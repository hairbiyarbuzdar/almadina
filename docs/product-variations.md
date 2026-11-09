# Product variations

In `/dab/products`, add or edit a product, turn on **This product has variations**, and enter an option name such as Shade, Color, or Size. Add named choices with stock quantities. Prices inherit the product price unless overridden. Swatches and images are optional.

Use **Available in shop** to hide a choice without removing historical orders. Stock of zero means sold out; customers can inspect that choice but cannot purchase it. Move up/down changes the display order. Products without variations continue to use their ordinary stock field.

The first version supports one option group per product. It does not generate combinations of multiple groups such as Shade × Size.

## Database deployment

Run `npx prisma migrate deploy` before deploying the updated application, and regenerate the Prisma client (`npm run build` already does this). The additive migration is `20261109000000_product_variations`; existing products and orders retain their data. The new table enables row-level security, and the application accesses it through its server-side Prisma connection.

## Verification

The database and browser tests require a dedicated local PostgreSQL database whose name ends in `_test`. They reject remote database URLs. Apply the migrations to that database first; do not point tests at a store database.

PowerShell example, with a local database already running:

```powershell
$env:TEST_DATABASE_URL='postgresql://postgres@127.0.0.1:55439/almadina_variations_test'
$env:DATABASE_URL=$env:TEST_DATABASE_URL
$env:DIRECT_URL=$env:TEST_DATABASE_URL
npx prisma migrate deploy
npm run test:variations
npm run test:e2e
```

Unit tests run without `TEST_DATABASE_URL`; database integration tests are skipped when it is absent. Browser tests start the app on port 3001. If reusing a server on that port, it must use the same isolated test database and test session secret from `playwright.config.ts`. Windows verification uses installed Chrome; other platforms use Playwright Chromium (`npx playwright install chromium`).

Coverage includes admin conversion, duplicate-name validation without losing entered details, ordering choices, hiding options, sold-out choices, image/price selection, separate cart lines, persisted carts, order snapshots, changed-price review, ordinary products, and simultaneous purchases of the final unit. Browser tests block external requests and create orders only in the local test database. Optional image upload uses the existing Supabase bucket; browser tests exercise image selection using local fixture images.
