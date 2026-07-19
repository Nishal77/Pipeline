import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const corpus = JSON.parse(readFileSync(join(dirname(fileURLToPath(import.meta.url)), "corpus.json"), "utf-8"));

test("corpus category counts match _meta", () => {
  for (const [category, expected] of Object.entries(corpus._meta.categories)) {
    const actual = corpus.dialogues.filter((d: { category: string }) => d.category === category).length;
    assert.equal(actual, expected, `${category}: expected ${expected}, got ${actual}`);
  }
});

test("every dialogue has a unique id and required fields", () => {
  const ids = new Set<string>();
  for (const d of corpus.dialogues) {
    assert.ok(d.id && d.category && d.opening_line && d.expected_behavior, `incomplete entry: ${JSON.stringify(d)}`);
    assert.ok(!ids.has(d.id), `duplicate id: ${d.id}`);
    ids.add(d.id);
  }
});
