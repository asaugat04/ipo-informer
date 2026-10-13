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
    "https://nepalipaisa.com/api/GetIpos";

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

  await Promise.all(
    ipos.flatMap((ipo) => {
      log.info(`Found ${recipients.length} recipients for IPO ${ipo.title}`);
      const subject = `New IPO: ${ipo.title}`;
      const html = `<p>Dear recipient,</p><p>There is a new IPO: <strong>${
        ipo.title
      }</strong></p><pre>${JSON.stringify(ipo.payload, null, 2)}</pre>`;

      return recipients.map((r) =>
        sendIpoEmail(r, subject, html).catch((err) =>
          log.error(`Failed to notify ${r}`, err),
        ),
      );
    }),
  );
  return ipos;
}
