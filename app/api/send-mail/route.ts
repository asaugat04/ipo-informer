import { NextRequest, NextResponse } from "next/server";
import { checkIPO } from "../../../lib/checkIpo";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized cron request" }, { status: 401 });
  }

  const ipos = await checkIPO();
  return NextResponse.json(ipos ?? []);
}
