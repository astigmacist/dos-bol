import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("contains the Qorgau AI experience and all demo roles", async () => {
  const [page, layout] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(layout, /title: "Qorgau AI/);
  assert.match(page, /Qorgau AI/);
  assert.match(page, /student.*Student123!/s);
  assert.match(page, /teacher.*Teacher123!/s);
  assert.match(page, /psychologist.*Psycho123!/s);
  assert.match(page, /admin.*Admin123!/s);
  assert.match(page, /type Role = "student" \| "teacher" \| "psychologist" \| "admin"/);
  assert.doesNotMatch(page, /SafeSchool/i);
});
