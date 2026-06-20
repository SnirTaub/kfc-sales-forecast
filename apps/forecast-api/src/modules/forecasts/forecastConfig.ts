import fs from "fs";
import path from "path";
import { z } from "zod";
import { env } from "../../config/env";

const forecastConfigSchema = z.object({
  generationIntervalHours: z.number().positive(),
  generationHourLocal: z.number().int().min(0).max(23),
  lookbackDays: z.number().int().positive(),
  minimumAverageQuantity: z.number().min(0),
});

export function loadForecastConfig() {
  const configPath = path.resolve(process.cwd(), env.forecastConfigPath);
  const rawConfig = fs.readFileSync(configPath, "utf-8");
  return forecastConfigSchema.parse(JSON.parse(rawConfig));
}

