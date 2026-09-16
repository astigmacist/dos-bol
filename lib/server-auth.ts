import { neon } from "@neondatabase/serverless";
import { cookies } from "next/headers";
import { createHmac, randomBytes, randomUUID, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

export type AccountRole = "student" | "teacher" | "psychologist" | "admin" | "site_admin";
export type PublicAccount = {
  id: string;
  login: string;
  role: AccountRole;
  name: string;
  initials: string;
  meta: { ru: string; kk: string };
  classNumber?: string;
  classLetter?: string;
};

type DatabaseAccount = {
  id: string;
  login: string;
  password_hash: string;
  role: AccountRole;
  name: string;
  initials: string;
  meta_ru: string;
  meta_kk: string;
  class_number: string | null;
  class_letter: string | null;
};

const SESSION_COOKIE = "dos_bol_session";
const SESSION_SECONDS = 60 * 60 * 24 * 30;
const scrypt = promisify(scryptCallback);
const seedAccounts = [
  { login: "student", password: "Student123!", role: "student", name: "Аян Серік", initials: "АС", metaRu: "7 «А» класс", metaKk: "7 «А» сынып", classNumber: "7", classLetter: "А" },
  { login: "teacher", password: "Teacher123!", role: "teacher", name: "Данияр Қасымов", initials: "ДҚ", metaRu: "Классный руководитель · 7 «А»", metaKk: "Сынып жетекшісі · 7 «А»" },
  { login: "psychologist", password: "Psycho123!", role: "psychologist", name: "Айгүл Омарова", initials: "АО", metaRu: "Школьный психолог", metaKk: "Мектеп психологы" },
  { login: "admin", password: "Admin123!", role: "admin", name: "Гүлмира Әлиева", initials: "ГӘ", metaRu: "Администратор школы · завуч", metaKk: "Мектеп әкімшісі · директор орынбасары" },
  { login: "bolatbekovameruert@gmail.com", password: "Meruert2026!", role: "site_admin", name: "Меруерт Болатбекова", initials: "МБ", metaRu: "Учитель · администратор сайта", metaKk: "Мұғалім · сайт әкімшісі" },
] satisfies Array<{ login: string; password: string; role: AccountRole; name: string; initials: string; metaRu: string; metaKk: string; classNumber?: string; classLetter?: string }>;

let setupPromise: Promise<void> | undefined;

function database() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64) as Buffer;
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [algorithm, saltHex, hashHex] = encoded.split("$");
  if (algorithm !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = await scrypt(password, Buffer.from(saltHex, "hex"), expected.length) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

async function setupDatabase() {
  const sql = database();
  await sql`
    CREATE TABLE IF NOT EXISTS dos_bol_accounts (
      id TEXT PRIMARY KEY,
      login TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL,
      name TEXT NOT NULL,
      initials TEXT NOT NULL,
      meta_ru TEXT NOT NULL,
      meta_kk TEXT NOT NULL,
      class_number TEXT,
      class_letter TEXT,
      created_by TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await Promise.all(seedAccounts.map(async (account) => {
    const passwordHash = await hashPassword(account.password);
    await sql`
      INSERT INTO dos_bol_accounts (
        id, login, password_hash, role, name, initials, meta_ru, meta_kk, class_number, class_letter, created_by
      ) VALUES (
        ${randomUUID()}, ${account.login}, ${passwordHash}, ${account.role}, ${account.name}, ${account.initials},
        ${account.metaRu}, ${account.metaKk}, ${account.classNumber ?? null}, ${account.classLetter ?? null}, NULL
      )
      ON CONFLICT (login) DO NOTHING
    `;
  }));
}

export async function ensureDatabase() {
  if (!setupPromise) {
    setupPromise = setupDatabase().catch((error) => {
      setupPromise = undefined;
      throw error;
    });
  }
  return setupPromise;
}

function toPublic(account: DatabaseAccount): PublicAccount {
  return {
    id: account.id,
    login: account.login,
    role: account.role,
    name: account.name,
    initials: account.initials,
    meta: { ru: account.meta_ru, kk: account.meta_kk },
    classNumber: account.class_number ?? undefined,
    classLetter: account.class_letter ?? undefined,
  };
}

export async function findAccount(login: string) {
  await ensureDatabase();
  const rows = await database()`SELECT * FROM dos_bol_accounts WHERE login = ${login.trim().toLowerCase()} LIMIT 1` as DatabaseAccount[];
  return rows[0] ?? null;
}

export async function listCreatedAccounts() {
  await ensureDatabase();
  const rows = await database()`SELECT * FROM dos_bol_accounts WHERE created_by IS NOT NULL ORDER BY created_at DESC` as DatabaseAccount[];
  return rows.map(toPublic);
}

export async function createAccount(input: {
  login: string;
  password: string;
  role: Exclude<AccountRole, "site_admin">;
  name: string;
  initials: string;
  meta: { ru: string; kk: string };
  classNumber?: string;
  classLetter?: string;
  createdBy: string;
}) {
  await ensureDatabase();
  const id = randomUUID();
  const passwordHash = await hashPassword(input.password);
  const rows = await database()`
    INSERT INTO dos_bol_accounts (
      id, login, password_hash, role, name, initials, meta_ru, meta_kk, class_number, class_letter, created_by
    ) VALUES (
      ${id}, ${input.login.trim().toLowerCase()}, ${passwordHash}, ${input.role}, ${input.name}, ${input.initials},
      ${input.meta.ru}, ${input.meta.kk}, ${input.classNumber ?? null}, ${input.classLetter ?? null}, ${input.createdBy}
    ) RETURNING *
  ` as DatabaseAccount[];
  return toPublic(rows[0]);
}

export async function deleteCreatedAccount(id: string) {
  await ensureDatabase();
  const rows = await database()`DELETE FROM dos_bol_accounts WHERE id = ${id} AND created_by IS NOT NULL RETURNING id` as Array<{ id: string }>;
  return rows.length > 0;
}

function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET is not configured");
  return secret;
}

function sign(value: string) {
  return createHmac("sha256", sessionSecret()).update(value).digest("base64url");
}

function createSessionToken(login: string) {
  const payload = Buffer.from(JSON.stringify({ sub: login, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function verifySessionToken(token: string) {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { sub?: string; exp?: number };
    if (!data.sub || !data.exp || data.exp <= Date.now() / 1000) return null;
    return data.sub;
  } catch {
    return null;
  }
}

export async function setSession(login: string) {
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(login), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function clearSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}

export async function currentAccount() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const login = verifySessionToken(token);
  if (!login) return null;
  const account = await findAccount(login);
  return account ? toPublic(account) : null;
}

export function publicAccount(account: DatabaseAccount) {
  return toPublic(account);
}
