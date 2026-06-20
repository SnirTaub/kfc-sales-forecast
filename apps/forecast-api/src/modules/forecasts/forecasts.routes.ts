import { Router } from "express";
import { asyncHandler } from "../../common/utils/asyncHandler";
import { forecastsController } from "./forecasts.controller";

const forecastsRouter = Router();

forecastsRouter.get("/", asyncHandler(forecastsController.getForecasts.bind(forecastsController)));
forecastsRouter.post("/generate", asyncHandler(forecastsController.generateForecasts.bind(forecastsController)));

export { forecastsRouter };

