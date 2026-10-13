import { prisma } from "./db";

const WINDOW_MS = 60 * 60 * 1000;
const LIMIT = 3;

// ponytail: counts rows per window instead of a token bucket, fine at this volume
export async function checkRateLimit(ip: string, route: string) {
  const since = new Date(Date.now() - WINDOW_MS);
  const count = await prisma.rateLimitHit.count({
    where: { ip, route, createdAt: { gte: since } },
  });

  if (count >= LIMIT) return false;

  await prisma.rateLimitHit.create({ data: { ip, route } });
  return true;
}
