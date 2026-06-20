import cors from "cors";
import express, { Express, Request, Response } from "express";
import helmet from "helmet";
import morgan from "morgan";
import { correlationIdMiddleware } from "./common/middleware/correlationId.middleware";
import { errorMiddleware } from "./common/middleware/error.middleware";
import { notFoundMiddleware } from "./common/middleware/notFound.middleware";
import { HttpStatusCode } from "./config/constants";
import { env } from "./config/env";
import { forecastsRouter } from "./modules/forecasts/forecasts.routes";
import { storesRouter } from "./modules/stores/stores.routes";

export function createApp(): Express {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.corsOrigin }));
  app.use(express.json());
  app.use(morgan("dev"));
  app.use(correlationIdMiddleware);

  app.get("/health", (_req: Request, res: Response) => {
    res.status(HttpStatusCode.OK).json({ status: "ok" });
  });

  app.use("/v1/stores", storesRouter);
  app.use("/v1/forecasts", forecastsRouter);

  app.use(notFoundMiddleware);
  app.use(errorMiddleware);

  return app;
}

