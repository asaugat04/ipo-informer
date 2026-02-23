import cron from "node-cron";
import { checkIPO } from "../services/checkIpo";
import { log } from "../utils/logger";

export let scheduledCorn: cron.ScheduledTask | undefined = undefined;

export function startScheduler() {
  const expr = process.env.CRON_EXPRESSION || "0 10 * * * "; // default: every day at 10
  // const expr = "* * * * *";

  log.info("Starting scheduler with expr:", expr);

  scheduledCorn = cron.schedule(
    expr,
    async () => {
      try {
        await checkIPO();
      } catch (err) {
        log.error("checkIPO failed", err);
      }
    },
    {
      name: "ipo-informer",
      timezone: "Asia/Kathmandu",
      // runOnInit: true,
      recoverMissedExecutions: true,
    },
  );
}
