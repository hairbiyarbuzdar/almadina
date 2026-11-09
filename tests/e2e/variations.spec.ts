import { test, expect } from "@playwright/test";
import { SignJWT } from "jose";
import { fixture, testDatabase } from "../test-db";

test("admin creates shades; customer chooses, carts and orders the right shades", async ({ page, context }, testInfo) => {
  const db = testDatabase();
  const product = await fixture(db, `qa-browser-${testInfo.project.name}-${Date.now()}`, false);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  // Test customers never send analytics events or requests to external services.
  await context.route("**/*", (route) => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
  const token = await new SignJWT({ role: "admin" }).setProtectedHeader({ alg: "HS256" }).setSubject("admin").setIssuedAt().setExpirationTime("1h").sign(new TextEncoder().encode("almadina-local-variation-test-session-secret-only"));
  await context.addCookies([{ name: "almadina_session", value: token, url: "http://127.0.0.1:3001" }]);

  try {
    await page.goto(`/dab/products/${product.id}/edit`);
    await page.getByLabel("This product has variations").check();
    const shades = [
      { name: "Ruby Red", stock: "10", color: "#ad233d" },
      { name: "Nude Pink", stock: "8", color: "#c88d92", price: "1700" },
      { name: "Dark Brown", stock: "0", color: "#634337" },
      { name: "Hidden Gold", stock: "5", color: "#a68741" },
    ];
    for (const [index, shade] of shades.entries()) {
      await page.getByRole("button", { name: "Add variation", exact: true }).click();
      await page.getByRole("textbox", { name: `Variation ${index + 1} name`, exact: true }).fill(shade.name);
      await page.getByRole("spinbutton", { name: `Variation ${index + 1} stock`, exact: true }).fill(shade.stock);
      if (shade.price) await page.getByRole("spinbutton", { name: `Variation ${index + 1} price`, exact: true }).fill(shade.price);
      const row = page.getByRole("group", { name: shade.name, exact: true });
      await row.getByLabel("Show color swatch").check();
      await row.getByLabel(`Variation ${index + 1} swatch color`).fill(shade.color);
      if (index === 3) await row.getByLabel("Available in shop").uncheck();
    }
    await page.getByRole("textbox", { name: "Variation 2 name", exact: true }).fill("Ruby Red");
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "listed twice" })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Variation 1 name", exact: true })).toHaveValue("Ruby Red");
    await expect(page.getByRole("spinbutton", { name: "Variation 2 price", exact: true })).toHaveValue("1700");
    await page.getByRole("textbox", { name: "Variation 2 name", exact: true }).fill("Nude Pink");
    await page.getByRole("button", { name: "Move variation 2 up", exact: true }).click();
    await expect(page.getByRole("textbox", { name: "Variation 1 name", exact: true })).toHaveValue("Nude Pink");
    await page.getByRole("button", { name: "Move variation 1 down", exact: true }).click();
    await page.screenshot({ path: testInfo.outputPath("admin-variations.png"), fullPage: true });
    await page.getByRole("button", { name: "Save changes", exact: true }).click();
    await expect(page).toHaveURL(/\/dab\/products$/);
    await expect(page.locator(`a[href="/dab/products/${product.id}/edit"]`).filter({ hasText: "18 total · 3 variations" })).toBeVisible();
    const saved = await db.product.findUniqueOrThrow({ where: { id: product.id }, include: { variants: true } });
    expect(saved.optionName).toBe("Shade");
    expect(saved.variants).toHaveLength(4);
    const pink = saved.variants.find((v) => v.name === "Nude Pink")!;
    // Use a local fixture image so image selection is tested without uploading to the store.
    await db.productVariant.update({ where: { id: pink.id }, data: { image: "/products/daily-hydrating-cream.jpg" } });

    await page.goto(`/shop/${product.slug}`);
    await expect(page.getByRole("button", { name: "Choose shade", exact: true })).toBeDisabled();
    await expect(page.getByRole("radio", { name: /Hidden Gold/ })).toHaveCount(0);
    await page.getByRole("radio", { name: /Dark Brown/ }).check();
    await expect(page.getByRole("button", { name: "Sold out", exact: true })).toBeDisabled();
    await page.getByRole("radio", { name: "Ruby Red", exact: true }).check();
    await page.getByRole("button", { name: "Add to Cart — Rs 1,500", exact: true }).click();
    await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("almadina-cart") ?? "[]").length)).toBe(1);
    await page.getByRole("radio", { name: "Nude Pink", exact: true }).check();
    await expect(page.locator("[data-product-image] img")).toHaveAttribute("alt", `${product.name} — Nude Pink`);
    await page.getByRole("button", { name: "Add to Cart — Rs 1,700", exact: true }).click();
    await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("almadina-cart") ?? "[]").length)).toBe(2);
    await page.getByRole("button", { name: "Cart", exact: true }).click();
    const cart = page.getByRole("dialog", { name: "Shopping cart" });
    await expect(cart.getByText("Shade: Ruby Red", { exact: true })).toBeVisible();
    await expect(cart.getByText("Shade: Nude Pink", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Close cart", exact: true }).click();
    await page.screenshot({ path: testInfo.outputPath("product-shades.png"), fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);

    await page.goto("/checkout");
    await expect(page.getByText("Shade: Ruby Red", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Shade: Nude Pink", { exact: true }).first()).toBeVisible();
    await page.getByLabel("Full name").fill("QA Browser Customer");
    await page.getByLabel("Phone number").fill("03000000000");
    await page.getByLabel("Address").fill("Local test address");
    await page.getByLabel("City").fill("Quetta");
    await page.screenshot({ path: testInfo.outputPath("checkout-shades.png"), fullPage: true });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    await page.getByRole("button", { name: "Place Order · Rs 3,200", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();
    const order = await db.order.findFirstOrThrow({ where: { name: "QA Browser Customer", items: { some: { productId: product.id } } }, include: { items: true } });
    expect(order.subtotal).toBe(3200);
    expect(order.items.map((v) => v.variantName).sort()).toEqual(["Shade: Nude Pink", "Shade: Ruby Red"]);
    expect((await db.productVariant.findUniqueOrThrow({ where: { id: pink.id } })).stock).toBe(7);
    await page.goto(`/dab/orders/${order.id}`);
    await expect(page.getByText("Shade: Ruby Red", { exact: true })).toBeVisible();
    await expect(page.getByText("Shade: Nude Pink", { exact: true })).toBeVisible();
    expect(errors).toEqual([]);
  } finally {
    await db.order.deleteMany({ where: { items: { some: { productId: product.id } } } });
    await db.product.delete({ where: { id: product.id } });
    await db.$disconnect();
  }
});

test("customer can recover from a price change before confirming the order", async ({ page, context }) => {
  const db = testDatabase();
  const product = await fixture(db, `qa-price-${Date.now()}`);
  const pink = product.variants[1];
  await context.route("**/*", (route) => new URL(route.request().url()).hostname === "127.0.0.1" ? route.continue() : route.abort());
  try {
    await page.goto(`/shop/${product.slug}`);
    await page.getByRole("radio", { name: "Nude Pink", exact: true }).check();
    await page.getByRole("button", { name: "Add to Cart — Rs 1,700", exact: true }).click();
    await expect.poll(async () => page.evaluate(() => JSON.parse(localStorage.getItem("almadina-cart") ?? "[]").length)).toBe(1);
    await db.productVariant.update({ where: { id: pink.id }, data: { price: 1800 } });
    await page.goto("/checkout");
    await page.getByLabel("Full name").fill("QA Price Customer");
    await page.getByLabel("Phone number").fill("03000000000");
    await page.getByLabel("Address").fill("Local test address");
    await page.getByLabel("City").fill("Quetta");
    await page.getByRole("button", { name: "Place Order · Rs 1,700", exact: true }).click();
    await expect(page.getByRole("alert").filter({ hasText: "The price" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Place Order · Rs 1,800", exact: true })).toBeVisible();
    expect(await db.order.count({ where: { items: { some: { productId: product.id } } } })).toBe(0);
    await page.getByRole("button", { name: "Place Order · Rs 1,800", exact: true }).click();
    await expect(page.getByRole("heading", { name: "Thank you for your order" })).toBeVisible();
  } finally {
    await db.order.deleteMany({ where: { items: { some: { productId: product.id } } } });
    await db.product.delete({ where: { id: product.id } });
    await db.$disconnect();
  }
});
