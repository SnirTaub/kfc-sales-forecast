import { apiGet, apiPost } from "./client";
import { ForecastResponse } from "../types/forecasts.types";

export async function getForecast(storeId: number, date: string): Promise<ForecastResponse> {
  return apiGet<ForecastResponse>(`/v1/forecasts?storeId=${storeId}&date=${date}`);
}

export async function generateForecast(date: string): Promise<{ targetDate: string; rowsAffected: number }> {
  return apiPost<{ targetDate: string; rowsAffected: number }>(`/v1/forecasts/generate?date=${date}`);
}

