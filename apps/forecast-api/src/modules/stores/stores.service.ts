import { Store } from "./stores.types";
import { storesProvider } from "./stores.provider";

export class StoresService {
  constructor(private readonly provider = storesProvider) {}

  public async getStores(): Promise<Store[]> {
    const rows = await this.provider.getStores();

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      city: row.city,
      address: row.address,
    }));
  }
}

export const storesService = new StoresService();

