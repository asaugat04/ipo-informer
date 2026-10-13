import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const subscriber = await prisma.subscriber.findUnique({ where: { unsubscribeToken: token } });
  if (!subscriber) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  await prisma.subscriber.update({
    where: { id: subscriber.id },
    data: { status: "UNSUBSCRIBED" },
  });

  return NextResponse.json({ message: "Unsubscribed" });
}
