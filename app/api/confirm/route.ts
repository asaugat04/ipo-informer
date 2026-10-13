import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  const subscriber = token
    ? await prisma.subscriber.findUnique({ where: { confirmToken: token } })
    : null;

  if (!subscriber) {
    return NextResponse.redirect(new URL("/confirmed?ok=0", req.url));
  }

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { status: "CONFIRMED", confirmedAt: new Date() },
  });

  return NextResponse.redirect(new URL("/confirmed?ok=1", req.url));
}
