import { NextResponse } from "next/server";
import { currentAccount } from "@/lib/server-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json({ account: await currentAccount() });
  } catch (error) {
    console.error("Session lookup failed", error);
    return NextResponse.json({ account: null, error: "service_unavailable" }, { status: 503 });
  }
}
