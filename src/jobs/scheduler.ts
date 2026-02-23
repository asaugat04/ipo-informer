import cron from "node-cron";
import { checkIPO } from "../services/checkIpo";
import { log } from "../utils/logger";

export function startScheduler() {
  const expr = process.env.CRON_EXPRESSION || "0 10 * * * "; // default: every day at 10
  // const expr = "* * * * *";

  log.info("Starting scheduler with expr:", expr);

  // node-cron expects 5 fields (minute hour day month weekday) by default.
  // If user provided 6-field cron (with seconds), node-cron still handles it.
  cron.schedule(expr, async () => {
    try {
      await checkIPO();
    } catch (err) {
      log.error("checkIPO failed", err);
    }
  });
}
