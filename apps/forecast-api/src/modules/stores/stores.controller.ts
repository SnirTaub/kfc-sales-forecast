import { Request, Response } from "express";
import { HttpStatusCode } from "../../config/constants";
import { logger } from "../../common/utils/logger";
import { storesService } from "./stores.service";

export class StoresController {
  public async getStores(req: Request, res: Response): Promise<void> {
    logger.info(req.correlationId, "StoresController/getStores - start");

    const stores = await storesService.getStores();

    logger.info(req.correlationId, "StoresController/getStores - end", { count: stores.length });
    res.status(HttpStatusCode.OK).json({ stores });
  }
}

export const storesController = new StoresController();

