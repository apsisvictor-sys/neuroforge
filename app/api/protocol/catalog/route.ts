import { NextResponse } from "next/server";
import { repositories } from "@/infrastructure/db/repositories";

export async function GET() {
  try {
    const items = await repositories.protocol.listTemplateCatalog();
    return NextResponse.json({ items }, { status: 200 });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
