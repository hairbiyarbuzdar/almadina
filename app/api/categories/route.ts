import { NextResponse } from "next/server";
import { getCategoryNames } from "../../lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const names = await getCategoryNames();
  return NextResponse.json(names);
}
