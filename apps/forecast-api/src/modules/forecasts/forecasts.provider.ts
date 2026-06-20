import { QueryResult } from "pg";
import { pgPool } from "../../infrastructure/db/pg";
import { ForecastConfig, ForecastQuery, ForecastRow } from "./forecasts.types";

export class ForecastsProvider {
  public async generateForecasts(targetDate: string, config: ForecastConfig): Promise<number> {
    const result = await pgPool.query(
      `
      WITH averaged_sales AS (
        SELECT
          sp.store_id,
          sp.product_id,
          hours.forecast_hour,
          GREATEST(
            $3::numeric,
            COALESCE(ROUND(AVG(s.quantity)::numeric, 2), $3::numeric)
          ) AS predicted_quantity
        FROM store_products sp
        CROSS JOIN generate_series(0, 23) AS hours(forecast_hour)
        LEFT JOIN sales s
          ON s.store_id = sp.store_id
         AND s.product_id = sp.product_id
         AND EXTRACT(HOUR FROM s.sold_at AT TIME ZONE 'Asia/Jerusalem')::int = hours.forecast_hour
         AND s.sold_at >= ($1::date - ($2::int * INTERVAL '1 day'))
         AND s.sold_at < $1::date
        GROUP BY sp.store_id, sp.product_id, hours.forecast_hour
      )
      INSERT INTO sales_forecasts (
        store_id,
        product_id,
        forecast_date,
        forecast_hour,
        predicted_quantity,
        generated_at,
        algorithm
      )
      SELECT
        store_id,
        product_id,
        $1::date,
        forecast_hour,
        predicted_quantity,
        NOW(),
        'hourly_average'
      FROM averaged_sales
      ON CONFLICT (store_id, product_id, forecast_date, forecast_hour)
      DO UPDATE SET
        predicted_quantity = EXCLUDED.predicted_quantity,
        generated_at = NOW(),
        algorithm = EXCLUDED.algorithm
      `,
      [targetDate, config.lookbackDays, config.minimumAverageQuantity]
    );

    return result.rowCount || 0;
  }

  public async getForecasts(query: ForecastQuery): Promise<ForecastRow[]> {
    const result: QueryResult<ForecastRow> = await pgPool.query(
      `
      SELECT
        sf.id,
        sf.store_id,
        s.name AS store_name,
        sf.product_id,
        p.name AS product_name,
        p.category AS product_category,
        sf.forecast_date,
        sf.forecast_hour,
        sf.predicted_quantity,
        sf.generated_at,
        sf.algorithm
      FROM sales_forecasts sf
      JOIN stores s ON s.id = sf.store_id
      JOIN products p ON p.id = sf.product_id
      WHERE sf.store_id = $1
        AND sf.forecast_date = $2::date
      ORDER BY sf.forecast_hour ASC, p.name ASC
      `,
      [query.storeId, query.date]
    );

    return result.rows;
  }
}

export const forecastsProvider = new ForecastsProvider();

