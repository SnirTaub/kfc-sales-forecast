import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpStatusCode } from "../../config/constants";
import { logger } from "../utils/logger";

export function errorMiddleware(error: unknown, req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      message: "Invalid request",
      issues: error.issues,
    });
    return;
  }

  logger.error(req.correlationId || "system", "Unhandled request error", { error });

  res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({
    message: "Internal server error",
  });
}

