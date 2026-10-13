import { NextResponse } from "next/server";
import { fetchIposFromProvider } from "../../../lib/checkIpo";

export async function GET() {
  const ipos = await fetchIposFromProvider();
  return NextResponse.json(ipos);
}
