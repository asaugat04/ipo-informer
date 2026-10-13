import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { log } from "../../../lib/logger";
import { sendMail } from "../../../lib/mailer";
import { checkRateLimit } from "../../../lib/rateLimit";
import { generateToken } from "../../../lib/tokens";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const email = body?.email?.trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  // Vercel's edge appends the real client IP as the last hop; a client-sent
  // x-forwarded-for value only ever prepends to that, so take the last entry.
  const forwardedFor = req.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",").pop()?.trim() || "unknown";

  const allowed = await checkRateLimit(ip, "subscribe");
  if (!allowed) {
    return NextResponse.json({ error: "Too many requests, try again later" }, { status: 429 });
  }

  const existing = await prisma.subscriber.findUnique({ where: { email } });
  if (existing?.status === "CONFIRMED") {
    return NextResponse.json({ message: "Already subscribed" });
  }

  const confirmToken = generateToken();
  const unsubscribeToken = generateToken();

  const subscriber = existing
    ? await prisma.subscriber.update({
        where: { email },
        data: { confirmToken, unsubscribeToken, status: "PENDING" },
      })
    : await prisma.subscriber.create({
        data: { email, confirmToken, unsubscribeToken },
      });

  const baseUrl = process.env.APP_URL || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const confirmUrl = `${baseUrl}/api/confirm?token=${subscriber.confirmToken}`;

  try {
    await sendMail(
      email,
      "Confirm your IPO Informer subscription",
      `<p>Click to confirm your subscription:</p><p><a href="${confirmUrl}">${confirmUrl}</a></p>`,
    );
  } catch (err) {
    log.error("Failed to send confirmation email", err);
    return NextResponse.json({ error: "Failed to send confirmation email" }, { status: 502 });
  }

  return NextResponse.json({ message: "Confirmation email sent" });
}
