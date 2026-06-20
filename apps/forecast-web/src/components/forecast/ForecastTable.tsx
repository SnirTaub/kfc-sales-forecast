import { ForecastResponse } from "../../types/forecasts.types";
import { formatHour } from "../../utils/date";
import { useMemo, useState } from "react";

interface ForecastTableProps {
  forecast: ForecastResponse | null;
}

export function ForecastTable({ forecast }: ForecastTableProps) {
  const [selectedProductId, setSelectedProductId] = useState<string>("all");

  const products = useMemo(() => {
    if (!forecast) {
      return [];
    }

    return Array.from(
      forecast.items.reduce((acc, item) => {
        acc.set(item.productId, {
          id: item.productId,
          name: item.productName,
          category: item.productCategory,
        });
        return acc;
      }, new Map<number, { id: number; name: string; category: string }>())
    )
      .map(([, product]) => product)
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [forecast]);

  const hourlyRows = useMemo(() => {
    if (!forecast) {
      return [];
    }

    return Array.from({ length: 24 }, (_, hour) => {
      const items = forecast.items.filter((item) => item.forecastHour === hour);
      const productQuantities = new Map(items.map((item) => [item.productId, Math.round(item.predictedQuantity)]));
      const total = items.reduce((sum, item) => sum + item.predictedQuantity, 0);

      return {
        hour,
        productQuantities,
        total: Math.round(total),
      };
    });
  }, [forecast]);

  if (!forecast || forecast.items.length === 0) {
    return (
      <section className="empty-state">
        <h2>No forecast found</h2>
        <p>Generate the selected date to persist a new hourly forecast.</p>
      </section>
    );
  }

  const isAllProductsSelected = selectedProductId === "all";
  const selectedProduct = products.find((product) => String(product.id) === selectedProductId);

  return (
    <section className="table-section">
      <div className="section-heading">
        <div>
          <h2>Hourly prep plan</h2>
          <span>{products.length} products across 24 hours</span>
        </div>
        <label className="compact-filter">
          <span>Product</span>
          <select value={selectedProductId} onChange={(event) => setSelectedProductId(event.target.value)}>
            <option value="all">All products</option>
            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="table-wrap">
        {isAllProductsSelected ? (
          <table className="forecast-matrix">
            <thead>
              <tr>
                <th>Hour</th>
                {products.map((product) => (
                  <th className="numeric" key={product.id}>
                    {product.name}
                  </th>
                ))}
                <th className="numeric">Hour total</th>
              </tr>
            </thead>
            <tbody>
              {hourlyRows.map((row) => (
                <tr key={row.hour} className={row.total > 0 ? "active-hour-row" : undefined}>
                  <td className="hour-cell">{formatHour(row.hour)}</td>
                  {products.map((product) => (
                    <td className="numeric" key={product.id}>
                      {row.productQuantities.get(product.id) || 0}
                    </td>
                  ))}
                  <td className="numeric total-cell">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="forecast-focus-table">
            <thead>
              <tr>
                <th>Hour</th>
                <th>Product</th>
                <th>Category</th>
                <th className="numeric">Predicted units</th>
              </tr>
            </thead>
            <tbody>
              {hourlyRows.map((row) => (
                <tr key={row.hour} className={(row.productQuantities.get(Number(selectedProductId)) || 0) > 0 ? "active-hour-row" : undefined}>
                  <td className="hour-cell">{formatHour(row.hour)}</td>
                  <td>{selectedProduct?.name}</td>
                  <td>{selectedProduct?.category}</td>
                  <td className="numeric total-cell">{row.productQuantities.get(Number(selectedProductId)) || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
}
