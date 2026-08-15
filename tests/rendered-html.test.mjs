import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source() {
  return Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
}

test("contains the Qorgau AI experience and every role", async () => {
  const [page, layout] = await source();
  assert.match(layout, /title: "Qorgau AI/);
  assert.match(page, /student.*Student123!/s);
  assert.match(page, /teacher.*Teacher123!/s);
  assert.match(page, /psychologist.*Psycho123!/s);
  assert.match(page, /admin.*Admin123!/s);
  assert.match(page, /site_admin/);
  assert.match(page, /bolatbekovameruert@gmail\.com/);
  assert.doesNotMatch(page, /SafeSchool/i);
});

test("student dashboard uses the authenticated account", async () => {
  const [page] = await source();
  assert.match(page, /<DashboardHome account=\{account\}/);
  assert.match(page, /function DashboardHome\(\{ account, lang, t, onSection \}/);
  assert.match(page, /const firstName = account\.name\.trim\(\)\.split/);
  assert.match(page, /`Добрый день, \$\{firstName\}!`/);
  assert.match(page, /`Қайырлы күн, \$\{firstName\}!`/);
  assert.doesNotMatch(page, /<h1>\{t\.welcome\}<\/h1>/);
});

test("created accounts retain role and class metadata", async () => {
  const [page] = await source();
  assert.match(page, /qorgau-created-accounts-v1/);
  assert.match(page, /LEGACY_ACCOUNTS_STORAGE_KEY/);
  assert.match(page, /readStoredAccounts/);
  assert.match(page, /persistAccounts\(accounts\)/);
  assert.match(page, /classNumber:grade,classLetter:letter/);
  assert.match(page, /\.\.\.demoAccounts,\s*\.\.\.createdAccounts/);
});

test("active session is restored after reload and cleared on logout", async () => {
  const [page] = await source();
  assert.match(page, /qorgau-active-session-v1/);
  assert.match(page, /localStorage\.setItem\(SESSION_STORAGE_KEY, account\.login\.toLowerCase\(\)\)/);
  assert.match(page, /savedAccount.*setActiveAccount\(savedAccount\)/s);
  assert.match(page, /function logout\(\).*localStorage\.removeItem\(SESSION_STORAGE_KEY\)/s);
  assert.match(page, /if \(!storageReady\)/);
});

test("AI chat cannot remain stuck forever", async () => {
  const [page] = await source();
  assert.match(page, /Promise\.race/);
  assert.match(page, /AI timeout/);
  assert.match(page, /15000/);
});
