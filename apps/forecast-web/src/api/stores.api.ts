import { apiGet } from "./client";
import { Store } from "../types/stores.types";

export async function getStores(): Promise<Store[]> {
  const response = await apiGet<{ stores: Store[] }>("/v1/stores");
  return response.stores;
}

