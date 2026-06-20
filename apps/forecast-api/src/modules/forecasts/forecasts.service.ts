import { logger } from "../../common/utils/logger";
import { getTomorrowDateOnly } from "./dateUtils";
import { loadForecastConfig } from "./forecastConfig";
import { forecastsProvider } from "./forecasts.provider";
import { ForecastItem, ForecastQuery, ForecastResponse } from "./forecasts.types";

export class ForecastsService {
  constructor(private readonly provider = forecastsProvider) {}

  public async generateForecasts(correlationId: string, targetDate = getTomorrowDateOnly()): Promise<{ targetDate: string; rowsAffected: number }> {
    const config = loadForecastConfig();

    logger.info(correlationId, "ForecastsService/generateForecasts - start", {
      targetDate,
      lookbackDays: config.lookbackDays,
    });

    const rowsAffected = await this.provider.generateForecasts(targetDate, config);

    logger.info(correlationId, "ForecastsService/generateForecasts - end", { targetDate, rowsAffected });

    return { targetDate, rowsAffected };
  }

  public async getForecasts(correlationId: string, query: ForecastQuery): Promise<ForecastResponse> {
    logger.info(correlationId, "ForecastsService/getForecasts - start", { storeId: query.storeId, date: query.date });

    const rows = await this.provider.getForecasts(query);
    const items = rows.map((row): ForecastItem => ({
      id: Number(row.id),
      storeId: row.store_id,
      storeName: row.store_name,
      productId: row.product_id,
      productName: row.product_name,
      productCategory: row.product_category,
      forecastDate: row.forecast_date,
      forecastHour: row.forecast_hour,
      predictedQuantity: Number(row.predicted_quantity),
      generatedAt: row.generated_at,
      algorithm: row.algorithm,
    }));

    const totalsByHour = Array.from(
      items.reduce((acc, item) => {
        acc.set(item.forecastHour, (acc.get(item.forecastHour) || 0) + item.predictedQuantity);
        return acc;
      }, new Map<number, number>())
    ).map(([hour, predictedQuantity]) => ({ hour, predictedQuantity: round(predictedQuantity) }));

    const totalsByProduct = Array.from(
      items.reduce((acc, item) => {
        const current = acc.get(item.productId) || { productId: item.productId, productName: item.productName, predictedQuantity: 0 };
        current.predictedQuantity += item.predictedQuantity;
        acc.set(item.productId, current);
        return acc;
      }, new Map<number, { productId: number; productName: string; predictedQuantity: number }>())
    ).map(([, item]) => ({ ...item, predictedQuantity: round(item.predictedQuantity) }));

    const response: ForecastResponse = {
      storeId: query.storeId,
      date: query.date,
      items,
      totalsByHour,
      totalsByProduct,
      totalPredictedQuantity: round(items.reduce((sum, item) => sum + item.predictedQuantity, 0)),
    };

    logger.info(correlationId, "ForecastsService/getForecasts - end", {
      count: response.items.length,
      totalPredictedQuantity: response.totalPredictedQuantity,
    });

    return response;
  }
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

export const forecastsService = new ForecastsService();
