import { NextResponse } from "next/server";
import { findAccount, publicAccount, setSession, verifyPassword } from "@/lib/server-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { login?: unknown; password?: unknown };
    if (typeof body.login !== "string" || typeof body.password !== "string") {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 400 });
    }
    const account = await findAccount(body.login);
    if (!account || !(await verifyPassword(body.password, account.password_hash))) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }
    await setSession(account.login);
    return NextResponse.json({ account: publicAccount(account) });
  } catch (error) {
    console.error("Login failed", error);
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }
}
