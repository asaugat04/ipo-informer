import { NextFunction, Request, Response } from "express";
import { log } from "../utils/logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  log.error(err);
  res
    .status(err.status || 500)
    .json({ error: err.message || "Internal Server Error" });
}
