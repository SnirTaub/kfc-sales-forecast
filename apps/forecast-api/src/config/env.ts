import dotenv from "dotenv";
import { parseCorsOrigins } from "./parseCorsOrigins";

dotenv.config();

function getEnv(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getNumberEnv(name: string): number {
  const parsed = Number(getEnv(name));

  if (Number.isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }

  return parsed;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: getNumberEnv("PORT"),
  corsOrigin: parseCorsOrigins(getEnv("CORS_ORIGIN")),
  forecastConfigPath: process.env.FORECAST_CONFIG_PATH?.trim() || "./config/forecast.config.json",
  database: {
    host: getEnv("DATABASE_HOST"),
    port: getNumberEnv("DATABASE_PORT"),
    name: getEnv("DATABASE_NAME"),
    user: getEnv("DATABASE_USER"),
    password: getEnv("DATABASE_PASSWORD"),
  },
} as const;

