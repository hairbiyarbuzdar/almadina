import assert from "node:assert/strict";
import test from "node:test";
import { addCartLine, cartLineKey, normalizeCart, type CartLine } from "../app/lib/cart-lines";
import { parseVariants, wholeNumber } from "../app/lib/variants";

const line: CartLine = { slug: "lipstick", name: "Lipstick", image: "/lipstick.jpg", size: "4g", price: 1500, qty: 1 };

test("different shades remain separate and adding the same shade combines quantities", () => {
  let cart = addCartLine([], { ...line, variantId: "red", stock: 5 }, 1);
  cart = addCartLine(cart, { ...line, variantId: "pink", stock: 8 }, 2);
  cart = addCartLine(cart, { ...line, variantId: "red", stock: 5 }, 2);
  assert.equal(cart.length, 2);
  assert.equal(cart.find((v) => v.variantId === "red")?.qty, 3);
  assert.notEqual(cartLineKey(cart[0]), cartLineKey(cart[1]));
});

test("legacy carts load; corrupt entries are discarded; quantities are capped by stock", () => {
  assert.deepEqual(normalizeCart([line]), [{ ...line, stock: undefined }]);
  assert.equal(normalizeCart([null, { ...line, qty: -1 }, { ...line, qty: "2" }]).length, 0);
  assert.equal(addCartLine([], { ...line, stock: 2 }, 8)[0].qty, 2);
  assert.equal(normalizeCart([{ ...line, stock: 0 }]).length, 0);
});

test("variation validation rejects duplicate names, invalid stock, prices and colors", () => {
  const v = { name: "Ruby Red", stock: "3", price: "", active: true };
  assert.equal(parseVariants(JSON.stringify([v]))[0].price, null);
  assert.throws(() => parseVariants(JSON.stringify([v, { ...v, name: " ruby red " }])));
  for (const patch of [{ stock: -1 }, { stock: "1.5" }, { price: 0 }, { color: "red" }, { image: "javascript:alert(1)" }]) {
    assert.throws(() => parseVariants(JSON.stringify([{ ...v, ...patch }])));
  }
  assert.equal(wholeNumber("-5"), null);
  assert.equal(wholeNumber("1.5"), null);
  assert.equal(wholeNumber("0"), 0);
});
