import { test, expect } from "@playwright/test";
import { SignJWT } from "jose";
import { join } from "node:path";
import { fixture, testDatabase } from "../test-db";

test("admin uploads multiple photos and customers browse the saved gallery", async ({ page, context }, testInfo) => {
  const db = testDatabase();
  const product = await fixture(db, `qa-gallery-${testInfo.project.name}-${Date.now()}`, false);
  let createdId: string | undefined;
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await context.route("**/*", (route) => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
  const token = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1h").sign(new TextEncoder().encode("almadina-local-variation-test-session-secret-only"));
  await context.addCookies([{ name: "almadina_session", value: token, url: "http://127.0.0.1:3001" }]);

  try {
    await page.goto(`/dab/products/${product.id}/edit`);
    await page.getByLabel("Add photos").setInputFiles([
      join(process.cwd(), "public/products/daily-hydrating-cream.jpg"),
      join(process.cwd(), "public/products/rose-water-toner.jpg"),
    ]);
    await expect(page.getByAltText(/^Product photo \d+ preview$/)).toHaveCount(3);
    await page.getByRole("button", { name: "Make photo 3 the cover", exact: true }).click();
    await page.getByRole("button", { name: "Move photo 3 earlier", exact: true }).click();
    await page.getByRole("button", { name: "Remove photo 3", exact: true }).click();
    await expect(page.getByAltText(/^Product photo \d+ preview$/)).toHaveCount(2);
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(page).toHaveURL(/\/dab\/products$/);
    const saved = await db.product.findUniqueOrThrow({ where: { id: product.id } });
    expect(saved.image).toContain("/storage/v1/object/public/product-images/");
    expect(saved.images).toHaveLength(1);
    expect(saved.images[0]).not.toBe(saved.image);
    // Reopening the form retains all photos, and a metadata save does not reupload.
    await page.goto(`/dab/products/${product.id}/edit`);
    await expect(page.getByAltText(/^Product photo \d+ preview$/)).toHaveCount(2);
    await page.screenshot({ path: testInfo.outputPath("admin-product-photos.png"), fullPage: true });
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(page).toHaveURL(/\/dab\/products$/);
    expect((await db.product.findUniqueOrThrow({ where: { id: product.id } })).images).toEqual(saved.images);

    await page.goto(`/shop/${product.slug}`);
    const gallery = page.getByRole("region", { name: "Product photo gallery" });
    const photo = gallery.locator("[data-product-image] img");
    await expect(gallery.getByText("Photo 1 of 2", { exact: true })).toBeVisible();
    await expect.poll(() => photo.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    await gallery.getByRole("button", { name: "Next product photo" }).click();
    await expect(gallery.getByText("Photo 2 of 2", { exact: true })).toBeVisible();
    await gallery.getByRole("button", { name: "Previous product photo" }).click();
    await expect(gallery.getByText("Photo 1 of 2", { exact: true })).toBeVisible();
    await gallery.getByRole("button", { name: "View photo 2 of 2" }).focus();
    await page.keyboard.press("Enter");
    await expect(gallery.getByRole("button", { name: "View photo 2 of 2" })).toHaveAttribute("aria-pressed", "true");
    if (testInfo.project.name === "mobile") {
      const surface = gallery.locator("[data-product-image]");
      await surface.scrollIntoViewIfNeeded();
      const box = (await surface.boundingBox())!;
      const session = await context.newCDPSession(page);
      const y = box.y + box.height / 2;
      await session.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: box.x + box.width * 0.8, y }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: box.x + box.width * 0.2, y }] });
      await session.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
      await session.detach();
      await expect(gallery.getByText("Photo 1 of 2", { exact: true })).toBeVisible();
    }
    await gallery.screenshot({ path: testInfo.outputPath("customer-product-gallery.png") });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    // Removing a photo persists, and a single-image product has no redundant controls.
    await page.goto(`/dab/products/${product.id}/edit`);
    await page.getByRole("button", { name: "Remove photo 2", exact: true }).click();
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(page).toHaveURL(/\/dab\/products$/);
    await page.goto(`/shop/${product.slug}`);
    await expect(page.getByRole("button", { name: "Next product photo" })).toHaveCount(0);

    await page.goto("/dab/products/new");
    await page.getByRole("textbox", { name: /^Name/ }).fill("QA New Gallery Product");
    await page.getByLabel("Slug (optional)").fill(`${product.slug}-new`);
    await page.getByLabel("Category").selectOption(product.categoryId);
    await page.getByRole("spinbutton", { name: /^Price/ }).fill("1500");
    await page.getByLabel("Add photos").setInputFiles([
      join(process.cwd(), "public/products/daily-hydrating-cream.jpg"),
      join(process.cwd(), "public/products/rose-water-toner.jpg"),
    ]);
    await page.getByRole("button", { name: "Create product", exact: true }).click();
    await expect(page).toHaveURL(/\/dab\/products$/);
    const created = await db.product.findUniqueOrThrow({ where: { slug: `${product.slug}-new` } });
    createdId = created.id;
    expect(created.images).toHaveLength(1);
    expect(created.image).toContain("/storage/v1/object/public/product-images/");
    expect(errors).toEqual([]);
  } finally {
    if (createdId) await db.product.delete({ where: { id: createdId } });
    await db.product.delete({ where: { id: product.id } });
    await db.$disconnect();
  }
});

test("invalid photos and upload failures preserve the product and allow recovery", async ({ page, context }) => {
  const db = testDatabase();
  const product = await fixture(db, `qa-gallery-errors-${Date.now()}`, false);
  const token = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("1h").sign(new TextEncoder().encode("almadina-local-variation-test-session-secret-only"));
  await context.addCookies([{ name: "almadina_session", value: token, url: "http://127.0.0.1:3001" }]);
  await context.route("**/*", (route) => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
  try {
    await page.goto(`/dab/products/${product.id}/edit`);
    await page.getByLabel("Add photos").setInputFiles({ name: "bad.txt", mimeType: "text/plain", buffer: Buffer.from("not an image") });
    await expect(page.getByRole("alert").filter({ hasText: "Choose JPG" })).toBeVisible();
    await expect(page.getByAltText(/^Product photo \d+ preview$/)).toHaveCount(1);
    // The local storage fixture deliberately rejects AVIF to exercise failed saves.
    await page.getByLabel("Add photos").setInputFiles({ name: "failure.avif", mimeType: "image/avif", buffer: Buffer.from("test failure") });
    await expect(page.getByAltText(/^Product photo \d+ preview$/)).toHaveCount(2);
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "Could not upload the product photos" })).toBeVisible();
    expect((await db.product.findUniqueOrThrow({ where: { id: product.id } })).images).toEqual([]);
    await expect(page.getByAltText(/^Product photo \d+ preview$/)).toHaveCount(2);
    await page.getByRole("button", { name: "Remove photo 2", exact: true }).click();
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(page).toHaveURL(/\/dab\/products$/);
  } finally {
    await db.product.delete({ where: { id: product.id } });
    await db.$disconnect();
  }
});
