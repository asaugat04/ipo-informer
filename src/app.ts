import express from "express";
import { errorHandler } from "./middleware/errorHandler";
import { fetchIposFromProvider } from "./services/checkIpo";

const app = express();
app.use(express.json());

app.get("/", (req, res) => res.json({ ok: true }));
app.get("/ipo", async (req, res) => {
  const resp = await fetchIposFromProvider();
  res.json(resp);
});

app.use(errorHandler);

export default app;
