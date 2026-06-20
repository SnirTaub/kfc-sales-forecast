import { ForecastResponse } from "../../types/forecasts.types";
import { Store } from "../../types/stores.types";

interface ForecastSummaryProps {
  forecast: ForecastResponse | null;
  selectedStore: Store | null;
}

export function ForecastSummary({ forecast, selectedStore }: ForecastSummaryProps) {
  const topProduct = forecast?.totalsByProduct.slice().sort((a, b) => b.predictedQuantity - a.predictedQuantity)[0];
  const peakHour = forecast?.totalsByHour.slice().sort((a, b) => b.predictedQuantity - a.predictedQuantity)[0];

  return (
    <section className="summary-grid" aria-label="Forecast summary">
      <article className="metric-card">
        <span>Total units</span>
        <strong>{forecast ? Math.round(forecast.totalPredictedQuantity) : "-"}</strong>
      </article>
      <article className="metric-card">
        <span>Store</span>
        <strong>{selectedStore?.name || "-"}</strong>
      </article>
      <article className="metric-card">
        <span>Peak hour</span>
        <strong>{peakHour ? `${String(peakHour.hour).padStart(2, "0")}:00` : "-"}</strong>
      </article>
      <article className="metric-card">
        <span>Top product</span>
        <strong>{topProduct?.productName || "-"}</strong>
      </article>
    </section>
  );
}

