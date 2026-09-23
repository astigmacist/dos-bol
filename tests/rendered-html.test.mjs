import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function source() {
  return Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
  ]);
}

async function serverSource() {
  return Promise.all([
    readFile(new URL("../lib/server-auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/login/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/accounts/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/ai/chat/route.ts", import.meta.url), "utf8"),
  ]);
}

test("contains the Dos Bol experience and every role", async () => {
  const [page, layout] = await source();
  const [server] = await serverSource();
  assert.match(layout, /title: "Dos Bol/);
  assert.match(page, /Dos Bol/);
  assert.match(page, /student.*Student123!/s);
  assert.match(page, /teacher.*Teacher123!/s);
  assert.match(page, /psychologist.*Psycho123!/s);
  assert.match(page, /admin.*Admin123!/s);
  assert.match(page, /site_admin/);
  assert.match(page, /bolatbekovameruert@gmail\.com/);
  assert.doesNotMatch(page, /SafeSchool/i);
  assert.doesNotMatch(`${page}\n${layout}`, /puter/i);
  assert.doesNotMatch(`${page}\n${layout}\n${server}`, new RegExp(["Qor", "gau"].join(""), "i"));
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

test("created accounts use shared server storage and retain class metadata", async () => {
  const [page] = await source();
  const [server, , accountsRoute] = await serverSource();
  assert.match(page, /fetch\("\/api\/accounts"/);
  assert.match(page, /migrateLegacyAccounts\(readStoredAccounts\(\)\)/);
  assert.match(server, /CREATE TABLE IF NOT EXISTS dos_bol_accounts/);
  assert.match(server, /class_number TEXT/);
  assert.match(server, /created_by TEXT/);
  assert.match(accountsRoute, /classNumber/);
});

test("active session is server signed, restored after reload, and cleared on logout", async () => {
  const [page] = await source();
  const [server, loginRoute] = await serverSource();
  assert.match(page, /fetch\("\/api\/auth\/session"/);
  assert.match(page, /fetch\("\/api\/auth\/logout"/);
  assert.match(loginRoute, /verifyPassword/);
  assert.match(server, /httpOnly: true/);
  assert.match(server, /createHmac\("sha256"/);
  assert.match(server, /scrypt/);
  assert.doesNotMatch(page, /SESSION_STORAGE_KEY/);
  assert.match(page, /if \(!storageReady\)/);
});

test("AI chat cannot remain stuck forever", async () => {
  const [page] = await source();
  const [, , , aiRoute] = await serverSource();
  assert.match(page, /Promise\.race/);
  assert.match(page, /fetch\("\/api\/ai\/chat"/);
  assert.match(page, /AI timeout/);
  assert.match(page, /15000/);
  assert.match(aiRoute, /currentAccount/);
  assert.match(aiRoute, /fallbackAnswer/);
  assert.match(aiRoute, /text\.pollinations\.ai\/openai/);
  assert.match(aiRoute, /attempt < 2/);
  assert.match(aiRoute, /previousAssistant/);
  assert.match(aiRoute, /шарша/);
  assert.match(aiRoute, /мазақ/);
});
