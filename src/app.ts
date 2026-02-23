import express from "express";
import { scheduledCorn } from "./jobs/scheduler";
import { errorHandler } from "./middleware/errorHandler";
import { fetchIposFromProvider } from "./services/checkIpo";

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true }));
app.get("/corn", (req, res) =>
  res.json({
    result: scheduledCorn ? "CORN job is scheduled" : "No corn scheduled",
  }),
);
app.get("/ipo", async (req, res) => {
  const resp = await fetchIposFromProvider();
  res.json(resp);
});

app.use(errorHandler);

export default app;
