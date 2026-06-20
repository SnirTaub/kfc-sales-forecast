import { ForecastControls } from "../components/forecast/ForecastControls";
import { ForecastSummary } from "../components/forecast/ForecastSummary";
import { ForecastTable } from "../components/forecast/ForecastTable";
import { ProductTotals } from "../components/forecast/ProductTotals";
import { PageLayout } from "../components/layout/PageLayout";
import { useForecastDashboard } from "../hooks/useForecastDashboard";

export function ForecastDashboardPage() {
  const dashboard = useForecastDashboard();

  return (
    <PageLayout>
      <ForecastControls
        stores={dashboard.stores}
        selectedStoreId={dashboard.selectedStoreId}
        selectedDate={dashboard.selectedDate}
        isLoading={dashboard.isLoadingForecast}
        onStoreChange={dashboard.setSelectedStoreId}
        onDateChange={dashboard.setSelectedDate}
        onRegenerate={dashboard.regenerateSelectedDate}
      />

      {dashboard.errorMessage && <div className="error-banner">{dashboard.errorMessage}</div>}

      <ForecastSummary forecast={dashboard.forecast} selectedStore={dashboard.selectedStore} />

      <div className="content-grid">
        <ForecastTable forecast={dashboard.forecast} />
        <ProductTotals forecast={dashboard.forecast} />
      </div>

      {(dashboard.isLoadingStores || dashboard.isLoadingForecast) && <div className="loading-bar">Loading forecast data...</div>}
    </PageLayout>
  );
}

