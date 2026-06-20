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

