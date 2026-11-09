import assert from "node:assert/strict";
import test from "node:test";
import { createOrder, type PlaceOrderInput } from "../app/lib/place-order";
import { fixture, testDatabase } from "./test-db";

test("variation checkout against PostgreSQL", { skip: !process.env.TEST_DATABASE_URL }, async (t) => {
  const db = testDatabase();
  const product = await fixture(db, `qa-integration-${Date.now()}`);
  const plain = await fixture(db, `qa-plain-${Date.now()}`, false);
  const [red, pink, brown, hidden] = product.variants;
  const input = (items: PlaceOrderInput["items"]): PlaceOrderInput => ({ name: "QA Integration", phone: "03000000000", address: "Test address", city: "Quetta", paymentMethod: "cod", items });
  const item = (variantId = red.id, qty = 1, price = 1500) => ({ slug: product.slug, variantId, qty, price, name: "Untrusted name" });
  try {
    await t.test("orders keep two shades separate and use authoritative names and prices", async () => {
      const result = await createOrder(db, input([item(), item(pink.id, 2, 1700)]));
      assert.equal(result.ok, true, result.error);
      assert.equal(result.subtotal, 4900);
      const order = await db.order.findUniqueOrThrow({ where: { id: result.orderId }, include: { items: true } });
      assert.deepEqual(order.items.map((v) => v.variantName).sort(), ["Shade: Nude Pink", "Shade: Ruby Red"]);
      assert.ok(order.items.every((v) => v.name === product.name));
      assert.equal((await db.productVariant.findUniqueOrThrow({ where: { id: red.id } })).stock, 9);
      assert.equal((await db.productVariant.findUniqueOrThrow({ where: { id: pink.id } })).stock, 6);
    });
    await t.test("rejects missing, foreign, hidden and sold-out choices", async () => {
      for (const row of [{ ...item(), variantId: undefined }, item("foreign"), item(hidden.id), item(brown.id)]) {
        assert.equal((await createOrder(db, input([row]))).ok, false);
      }
      const stale = await createOrder(db, input([item(red.id, 1, 1)]));
      assert.equal(stale.ok, false);
      assert.equal(stale.cart?.[0].price, 1500);
      assert.equal(await db.order.count({ where: { name: "QA Integration" } }), 1);
    });
    await t.test("duplicate lines cannot bypass stock and invalid quantities never create orders", async () => {
      const result = await createOrder(db, input([item(red.id, 5), item(red.id, 5)]));
      assert.equal(result.ok, false);
      assert.equal(result.cart?.[0].qty, 9);
      for (const qty of [0, -1, 1.5, NaN, Infinity]) assert.equal((await createOrder(db, input([item(red.id, qty)]))).ok, false);
    });
    await t.test("simultaneous purchases of the last unit allow exactly one order", async () => {
      await db.productVariant.update({ where: { id: red.id }, data: { stock: 1 } });
      const results = await Promise.all([createOrder(db, input([item()])), createOrder(db, input([item()]))]);
      assert.equal(results.filter((r) => r.ok).length, 1, JSON.stringify(results));
      assert.equal((await db.productVariant.findUniqueOrThrow({ where: { id: red.id } })).stock, 0);
    });
    await t.test("plain products still check out and removed products cannot use client prices", async () => {
      const result = await createOrder(db, input([{ slug: plain.slug, qty: 2, price: 1500, name: plain.name }]));
      assert.equal(result.ok, true, result.error);
      assert.equal((await db.product.findUniqueOrThrow({ where: { id: plain.id } })).stock, 8);
      assert.equal((await createOrder(db, input([{ slug: "missing-product", qty: 1, price: 1, name: "Fake" }]))).ok, false);
    });
    await t.test("renaming and deleting variations preserve the purchased shade snapshot", async () => {
      await db.productVariant.update({ where: { id: pink.id }, data: { name: "New Pink", active: false } });
      await db.productVariant.delete({ where: { id: pink.id } });
      const snapshot = await db.orderItem.findFirstOrThrow({ where: { variantName: "Shade: Nude Pink", order: { name: "QA Integration" } } });
      assert.equal(snapshot.variantName, "Shade: Nude Pink");
      assert.equal(snapshot.variantId, null);
    });
  } finally {
    await db.order.deleteMany({ where: { name: "QA Integration" } });
    await db.product.deleteMany({ where: { id: { in: [product.id, plain.id] } } });
    await db.$disconnect();
  }
});
