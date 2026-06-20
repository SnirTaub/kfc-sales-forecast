import { Request, Response } from "express";
import { HttpStatusCode } from "../../config/constants";
import { forecastQuerySchema, generateForecastQuerySchema } from "./forecasts.schemas";
import { forecastsService } from "./forecasts.service";

export class ForecastsController {
  public async getForecasts(req: Request, res: Response): Promise<void> {
    const query = forecastQuerySchema.parse(req.query);
    const forecasts = await forecastsService.getForecasts(req.correlationId, query);
    res.status(HttpStatusCode.OK).json(forecasts);
  }

  public async generateForecasts(req: Request, res: Response): Promise<void> {
    const query = generateForecastQuerySchema.parse(req.query);
    const result = await forecastsService.generateForecasts(req.correlationId, query.date);
    res.status(HttpStatusCode.CREATED).json(result);
  }
}

export const forecastsController = new ForecastsController();

