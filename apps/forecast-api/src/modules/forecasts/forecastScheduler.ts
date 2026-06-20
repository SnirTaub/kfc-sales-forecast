import { logger } from "../../common/utils/logger";
import { loadForecastConfig } from "./forecastConfig";
import { millisecondsUntilNextLocalHour } from "./dateUtils";
import { forecastsService } from "./forecasts.service";

export function startForecastScheduler(): () => void {
  const config = loadForecastConfig();
  const intervalMs = config.generationIntervalHours * 60 * 60 * 1000;
  let interval: NodeJS.Timeout | null = null;

  const run = async () => {
    try {
      await forecastsService.generateForecasts("scheduler");
    } catch (error) {
      logger.error("scheduler", "Forecast scheduler failed", { error });
    }
  };

  const firstDelayMs = millisecondsUntilNextLocalHour(config.generationHourLocal);

  const timeout = setTimeout(() => {
    void run();
    interval = setInterval(() => void run(), intervalMs);
  }, firstDelayMs);

  logger.info("scheduler", "Forecast scheduler started", {
    generationHourLocal: config.generationHourLocal,
    generationIntervalHours: config.generationIntervalHours,
    firstRunInMs: firstDelayMs,
  });

  return () => {
    clearTimeout(timeout);

    if (interval) {
      clearInterval(interval);
    }

    logger.info("scheduler", "Forecast scheduler stopped");
  };
}
