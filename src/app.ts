import express from "express";
import { scheduledCorn } from "./jobs/scheduler";
import { errorHandler } from "./middleware/errorHandler";
import { checkIPO, fetchIposFromProvider } from "./services/checkIpo";

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true }));
app.get("/corn", (req, res) =>
  res.json({
    result: scheduledCorn ? "CORN job is scheduled" : "No corn scheduled",
  }),
);

app.get("/send-mail", async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    const err: any = new Error("Unauthorized cron request");
    err.status = 401;
    return next(err);
  }

  const ipos = await checkIPO();
  console.log("cron hit");
  res.json(ipos);
});
app.get("/ipo", async (req, res) => {
  const resp = await fetchIposFromProvider();
  res.json(resp);
});

app.use(errorHandler);

export default app;
