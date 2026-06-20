import { createApp } from "./app";
import { logger } from "./common/utils/logger";
import { env } from "./config/env";
import { closePostgresConnection, verifyPostgresConnection } from "./infrastructure/db/pg";
import { startForecastScheduler } from "./modules/forecasts/forecastScheduler";
import { forecastsService } from "./modules/forecasts/forecasts.service";

async function bootstrap(): Promise<void> {
  await verifyPostgresConnection();

  await forecastsService.generateForecasts("bootstrap");
  const stopForecastScheduler = startForecastScheduler();

  const app = createApp();

  const server = app.listen(env.port, () => {
    logger.info("system", "API server started", { port: env.port });
  });

  const shutdown = async (signal: NodeJS.Signals): Promise<void> => {
    logger.info("system", "API server shutdown started", { signal });

    stopForecastScheduler();

    server.close(async (error?: Error) => {
      if (error) {
        logger.error("system", "API server shutdown failed while closing HTTP server", { error });
        process.exit(1);
      }

      try {
        await closePostgresConnection();
        logger.info("system", "API server shutdown completed", { signal });
        process.exit(0);
      } catch (closeError) {
        logger.error("system", "API server shutdown failed while closing resources", { error: closeError });
        process.exit(1);
      }
    });
  };

  process.once("SIGINT", () => void shutdown("SIGINT"));
  process.once("SIGTERM", () => void shutdown("SIGTERM"));
}

bootstrap().catch((error: unknown) => {
  logger.error("system", "Failed to start API server", { error });
  process.exit(1);
});
