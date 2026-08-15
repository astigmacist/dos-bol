import { NextResponse } from "next/server";
import { createAccount, currentAccount, deleteCreatedAccount, listCreatedAccounts, type AccountRole } from "@/lib/server-auth";

const creatableRoles: Array<Exclude<AccountRole, "site_admin">> = ["student", "teacher", "psychologist", "admin"];

async function requireSiteAdmin() {
  const account = await currentAccount();
  return account?.role === "site_admin" ? account : null;
}

export async function GET() {
  try {
    if (!(await requireSiteAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return NextResponse.json({ accounts: await listCreatedAccounts() });
  } catch (error) {
    console.error("Account list failed", error);
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const admin = await requireSiteAdmin();
    if (!admin) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const body = await request.json() as Record<string, unknown>;
    const role = body.role;
    const login = typeof body.login === "string" ? body.login.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const initials = typeof body.initials === "string" ? body.initials.trim().slice(0, 4).toUpperCase() : "";
    const classNumber = typeof body.classNumber === "string" ? body.classNumber.trim() : undefined;
    const classLetter = typeof body.classLetter === "string" ? body.classLetter.trim().toUpperCase() : undefined;

    if (!creatableRoles.includes(role as Exclude<AccountRole, "site_admin">) || login.length < 3 || password.length < 6 || !name || !initials) {
      return NextResponse.json({ error: "invalid_account" }, { status: 400 });
    }
    if (role === "student" && (!classNumber || !classLetter || !/^(?:[1-9]|1[01])$/.test(classNumber))) {
      return NextResponse.json({ error: "invalid_class" }, { status: 400 });
    }

    const metas = {
      student: { ru: `${classNumber} «${classLetter}» класс`, kk: `${classNumber} «${classLetter}» сынып` },
      teacher: { ru: "Учитель", kk: "Мұғалім" },
      psychologist: { ru: "Школьный психолог", kk: "Мектеп психологы" },
      admin: { ru: "Завуч школы", kk: "Директор орынбасары" },
    };
    const account = await createAccount({
      login,
      password,
      role: role as Exclude<AccountRole, "site_admin">,
      name,
      initials,
      meta: metas[role as Exclude<AccountRole, "site_admin">],
      classNumber,
      classLetter,
      createdBy: admin.login,
    });
    return NextResponse.json({ account }, { status: 201 });
  } catch (error) {
    if (String(error).includes("duplicate key") || String(error).includes("23505")) {
      return NextResponse.json({ error: "login_exists" }, { status: 409 });
    }
    console.error("Account creation failed", error);
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await requireSiteAdmin())) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    const id = new URL(request.url).searchParams.get("id");
    if (!id) return NextResponse.json({ error: "missing_id" }, { status: 400 });
    return NextResponse.json({ deleted: await deleteCreatedAccount(id) });
  } catch (error) {
    console.error("Account deletion failed", error);
    return NextResponse.json({ error: "service_unavailable" }, { status: 503 });
  }
}
