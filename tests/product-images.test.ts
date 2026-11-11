import test from "node:test";
import assert from "node:assert/strict";
import { parseImageReferences, validateImageFile } from "../app/lib/product-images";

test("gallery references preserve ordering and reject foreign images, duplicates and empty galleries", () => {
  const refs = [{ uploadKey: "new-photo" }, { url: "/existing.jpg" }];
  assert.deepEqual(parseImageReferences(JSON.stringify(refs), ["/existing.jpg"]), refs);
  for (const invalid of [[], [{ url: "https://foreign.example/photo.jpg" }], [{ url: "/existing.jpg" }, { url: "/existing.jpg" }], [{ uploadKey: "../secret" }], Array.from({ length: 13 }, (_, i) => ({ uploadKey: `photo-${i}` }))]) {
    assert.throws(() => parseImageReferences(JSON.stringify(invalid), ["/existing.jpg"]));
  }
});

test("image files enforce supported formats and individual size limits", () => {
  assert.doesNotThrow(() => validateImageFile(new File(["photo"], "photo.jpg", { type: "image/jpeg" })));
  assert.throws(() => validateImageFile(new File(["text"], "file.txt", { type: "text/plain" })));
  assert.throws(() => validateImageFile(new File([], "empty.png", { type: "image/png" })));
  assert.throws(() => validateImageFile(new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.png", { type: "image/png" })));
});
