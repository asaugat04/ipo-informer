import axios from "axios";
import { prisma } from "./db";
import { IPOResponseDTO } from "./ipo.types";
import { log } from "./logger";
import { sendMail } from "./mailer";

interface IPO {
  title: string;
  payload: any;
}

export async function fetchIposFromProvider(): Promise<IPO[]> {
  const url = "https://nepalipaisa.com/api/GetIpos";

  const response = await axios.get<IPOResponseDTO>(url);
  const data = response.data;

  const filtered = data.result.data.filter(
    (r) =>
      r.status.toLocaleLowerCase() == "open" &&
      r.shareType.toLocaleLowerCase() == "ordinary",
  );

  return filtered.map((d) => ({ title: d.companyName, payload: d }));
}

export async function checkIPO() {
  log.info("Running checkIPO...");
  const ipos = await fetchIposFromProvider();
  if (!ipos || ipos.length === 0) {
    log.info("No IPOs found");
    return ipos;
  }

  const subscribers = await prisma.subscriber.findMany({
    where: { status: "CONFIRMED" },
    select: { email: true, unsubscribeToken: true },
  });

  log.info(`Notifying ${subscribers.length} subscribers of ${ipos.length} IPO(s)`);

  const baseUrl = process.env.APP_URL;
  if (!baseUrl) {
    throw new Error("APP_URL is not set, refusing to send emails with a broken unsubscribe link");
  }

  await Promise.all(
    ipos.flatMap((ipo) => {
      const subject = `New IPO: ${ipo.title}`;

      return subscribers.map((s) => {
        const unsubscribeUrl = `${baseUrl}/api/unsubscribe?token=${s.unsubscribeToken}`;
        const html = `<p>There is a new IPO: <strong>${ipo.title}</strong></p><pre>${JSON.stringify(
          ipo.payload,
          null,
          2,
        )}</pre><p><a href="${unsubscribeUrl}">Unsubscribe</a></p>`;

        return sendMail(s.email, subject, html).catch((err) =>
          log.error(`Failed to notify ${s.email}`, err),
        );
      });
    }),
  );

  return ipos;
}
