export interface ForecastConfig {
  generationIntervalHours: number;
  generationHourLocal: number;
  lookbackDays: number;
  minimumAverageQuantity: number;
}

export interface ForecastQuery {
  storeId: number;
  date: string;
}

export interface GenerateForecastQuery {
  date?: string;
}

export interface ForecastRow {
  id: string;
  store_id: number;
  store_name: string;
  product_id: number;
  product_name: string;
  product_category: string;
  forecast_date: string;
  forecast_hour: number;
  predicted_quantity: string;
  generated_at: string;
  algorithm: string;
}

export interface ForecastItem {
  id: number;
  storeId: number;
  storeName: string;
  productId: number;
  productName: string;
  productCategory: string;
  forecastDate: string;
  forecastHour: number;
  predictedQuantity: number;
  generatedAt: string;
  algorithm: string;
}

export interface ForecastResponse {
  storeId: number;
  date: string;
  items: ForecastItem[];
  totalsByHour: Array<{ hour: number; predictedQuantity: number }>;
  totalsByProduct: Array<{ productId: number; productName: string; predictedQuantity: number }>;
  totalPredictedQuantity: number;
}

