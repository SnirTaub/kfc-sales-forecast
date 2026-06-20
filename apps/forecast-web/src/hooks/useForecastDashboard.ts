import { useEffect, useMemo, useState } from "react";
import { generateForecast, getForecast } from "../api/forecasts.api";
import { getStores } from "../api/stores.api";
import { ForecastResponse } from "../types/forecasts.types";
import { Store } from "../types/stores.types";
import { getTomorrowDateOnly } from "../utils/date";
import { getSavedDate, getSavedStoreId, saveDate, saveStoreId } from "../utils/storage";

export function useForecastDashboard() {
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<number | null>(getSavedStoreId());
  const [selectedDate, setSelectedDate] = useState(getSavedDate() || getTomorrowDateOnly());
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [isLoadingStores, setIsLoadingStores] = useState(true);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    getStores()
      .then((storesResult) => {
        if (!isActive) {
          return;
        }

        setStores(storesResult);
        setSelectedStoreId((currentStoreId) => currentStoreId || storesResult[0]?.id || null);
      })
      .catch(() => {
        if (isActive) {
          setErrorMessage("Could not load stores.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingStores(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedStoreId || !selectedDate) {
      return;
    }

    let isActive = true;
    setIsLoadingForecast(true);
    setErrorMessage(null);

    saveStoreId(selectedStoreId);
    saveDate(selectedDate);

    getForecast(selectedStoreId, selectedDate)
      .then((forecastResult) => {
        if (isActive) {
          setForecast(forecastResult);
        }
      })
      .catch(() => {
        if (isActive) {
          setForecast(null);
          setErrorMessage("Could not load forecasts for this store and date.");
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingForecast(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [selectedStoreId, selectedDate]);

  const selectedStore = useMemo(
    () => stores.find((store) => store.id === selectedStoreId) || null,
    [stores, selectedStoreId]
  );

  async function regenerateSelectedDate(): Promise<void> {
    if (!selectedStoreId) {
      return;
    }

    setIsLoadingForecast(true);
    setErrorMessage(null);

    try {
      await generateForecast(selectedDate);
      setForecast(await getForecast(selectedStoreId, selectedDate));
    } catch {
      setErrorMessage("Could not regenerate the forecast.");
    } finally {
      setIsLoadingForecast(false);
    }
  }

  return {
    stores,
    selectedStore,
    selectedStoreId,
    selectedDate,
    forecast,
    isLoadingStores,
    isLoadingForecast,
    errorMessage,
    setSelectedStoreId,
    setSelectedDate,
    regenerateSelectedDate,
  };
}

