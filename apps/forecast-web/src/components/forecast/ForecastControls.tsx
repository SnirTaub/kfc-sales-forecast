import { Store } from "../../types/stores.types";

interface ForecastControlsProps {
  stores: Store[];
  selectedStoreId: number | null;
  selectedDate: string;
  isLoading: boolean;
  onStoreChange: (storeId: number) => void;
  onDateChange: (date: string) => void;
  onRegenerate: () => void;
}

export function ForecastControls({
  stores,
  selectedStoreId,
  selectedDate,
  isLoading,
  onStoreChange,
  onDateChange,
  onRegenerate,
}: ForecastControlsProps) {
  return (
    <section className="controls-band" aria-label="Forecast filters">
      <label>
        <span>Store</span>
        <select
          value={selectedStoreId || ""}
          disabled={stores.length === 0}
          onChange={(event) => onStoreChange(Number(event.target.value))}
        >
          {stores.map((store) => (
            <option key={store.id} value={store.id}>
              {store.name} - {store.city}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Forecast date</span>
        <input type="date" value={selectedDate} onChange={(event) => onDateChange(event.target.value)} />
      </label>

      <button type="button" onClick={onRegenerate} disabled={isLoading || !selectedStoreId}>
        Regenerate
      </button>
    </section>
  );
}

