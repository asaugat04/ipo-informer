import axios from "axios";
import { recipients } from "../data/recipients";
import { log } from "../utils/logger";
import { IPOResponseDTO } from "./ipo.types";
import { sendIpoEmail } from "./mailer";

interface IPO {
  title: string;
  payload: any;
}

export interface IpoRow {
  sn: number;
  companyName: string;
  issueManager: string;
  issuedUnit: number;
  numberOfApplication: number;
  appliedUnit: number;
  amount: number;
  openDate: string;
  closeDate: string;
  lastUpdate: string;
}

// Replace this with the actual IPO fetching logic (external API call)
export async function fetchIposFromProvider(): Promise<IPO[]> {
  const url =
    "https://nepalipaisa.com/api/GetIpos?stockSymbol=&pageNo=1&itemsPerPage=10&pagePerDisplay=5&_=1771867739442";

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
    return;
  }

  for (const ipo of ipos) {
    log.info(`Found ${recipients.length} recipients for IPO ${ipo.title}`);

    // send email to each recipient and record SentNotification; batch or queue in production
    for (const r of recipients) {
      try {
        const subject = `New IPO: ${ipo.title}`;
        const html = `<p>Dear ${r},</p><p>There is a new IPO: <strong>${
          ipo.title
        }</strong></p><pre>${JSON.stringify(ipo.payload, null, 2)}</pre>`;

        await sendIpoEmail(r, subject, html);
      } catch (err) {
        log.error(`Failed to notify ${r}`, err);
        // in production: add retry mechanism, DLQ, or mark failure for manual review
      }
    }
  }
  return ipos;
}
