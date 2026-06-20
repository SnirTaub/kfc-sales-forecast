import { ForecastResponse } from "../../types/forecasts.types";

interface ProductTotalsProps {
  forecast: ForecastResponse | null;
}

export function ProductTotals({ forecast }: ProductTotalsProps) {
  if (!forecast || forecast.totalsByProduct.length === 0) {
    return null;
  }

  return (
    <section className="product-section">
      <div className="section-heading">
        <h2>Product totals</h2>
        <span>Daily prep view</span>
      </div>
      <div className="product-list">
        {forecast.totalsByProduct.map((product) => (
          <article className="product-row" key={product.productId}>
            <span>{product.productName}</span>
            <strong>{Math.round(product.predictedQuantity)}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

