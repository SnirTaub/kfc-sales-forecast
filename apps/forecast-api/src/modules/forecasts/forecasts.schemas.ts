import { z } from "zod";

const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must use YYYY-MM-DD format");

export const forecastQuerySchema = z.object({
  storeId: z.coerce.number().int().positive(),
  date: dateSchema,
});

export const generateForecastQuerySchema = z.object({
  date: dateSchema.optional(),
});

