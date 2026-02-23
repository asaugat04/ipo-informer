import "dotenv/config";
import app from "./app";
import { startScheduler } from "./jobs/scheduler";
import { log } from "./utils/logger";

const PORT = Number(process.env.PORT || 4000);

const server = app.listen(PORT, async () => {
  log.info(`Server listening on ${PORT}`);

  startScheduler();
});
