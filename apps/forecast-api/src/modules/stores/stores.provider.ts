import { QueryResult } from "pg";
import { pgPool } from "../../infrastructure/db/pg";
import { StoreRow } from "./stores.types";

export class StoresProvider {
  public async getStores(): Promise<StoreRow[]> {
    const result: QueryResult<StoreRow> = await pgPool.query(
      `
      SELECT id, name, city, address
      FROM stores
      ORDER BY name ASC
      `
    );

    return result.rows;
  }
}

export const storesProvider = new StoresProvider();

