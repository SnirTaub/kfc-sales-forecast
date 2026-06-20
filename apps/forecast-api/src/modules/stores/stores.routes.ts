import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { storesController } from "./stores.controller";

const storesRouter = Router();

storesRouter.get("/", asyncHandler(storesController.getStores.bind(storesController)));

export { storesRouter };

