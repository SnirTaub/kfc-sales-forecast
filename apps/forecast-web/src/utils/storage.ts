const STORE_KEY = "kfc-forecast:selected-store-id";
const DATE_KEY = "kfc-forecast:selected-date";

export function getSavedStoreId(): number | null {
  const rawValue = localStorage.getItem(STORE_KEY);
  const parsed = Number(rawValue);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function saveStoreId(storeId: number): void {
  localStorage.setItem(STORE_KEY, String(storeId));
}

export function getSavedDate(): string | null {
  return localStorage.getItem(DATE_KEY);
}

export function saveDate(date: string): void {
  localStorage.setItem(DATE_KEY, date);
}

