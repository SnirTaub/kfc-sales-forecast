# KFC Sales Forecast

Full-stack home assignment for DragonTail.

- Backend: Node.js, Express, TypeScript, PostgreSQL
- Frontend: React, TypeScript, Vite
- Forecasting: daily persisted hourly sales predictions by store and product

## Product Design

A KFC operations team needs a quick way to see tomorrow's expected sales per store so cooks can prepare earlier and reduce waste.

The system stores historical hourly sales and generates forecasts with a simple average calculation:

```text
forecast quantity = average historical sold quantity
for the same store + product + hour
```

Generated forecasts are persisted in PostgreSQL and can be retrieved by store and date.

## Project Shape

```text
apps/
  forecast-api/
    src/
      modules/
        stores/
        forecasts/
      infrastructure/db/
      common/
      config/
    config/forecast.config.json
    schema.sql
  forecast-web/
    src/
      api/
      components/
      hooks/
      pages/
      types/
```

## Run With Docker

From the project root:

```bash
docker compose up --build
```

Services:

- UI: http://localhost:5173
- API: http://localhost:3001
- PostgreSQL: internal Docker network service named `db`

The database is initialized automatically from `apps/forecast-api/schema.sql`.

If you previously ran an older version of this project, reset the Docker volume once so Postgres re-initializes with the current Docker settings:

```bash
docker compose down -v
docker compose up --build
```

## Run Locally

### API

```bash
cd apps/forecast-api
npm install
npm start
```

Create `.env` if you are not using Docker:

```env
PORT=3001
CORS_ORIGIN=[http://localhost:5173]
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=kfc_forecast
DATABASE_USER=postgres
# Optional if your local Postgres requires password authentication.
DATABASE_PASSWORD=
FORECAST_CONFIG_PATH=./config/forecast.config.json
```

### Web

```bash
cd apps/forecast-web
npm install
npm start
```

Create `.env` if needed:

```env
VITE_API_BASE_URL=http://localhost:3001
```

## Config

Forecast behavior is managed by `apps/forecast-api/config/forecast.config.json`:

```json
{
  "generationIntervalHours": 24,
  "generationHourLocal": 2,
  "lookbackDays": 14,
  "minimumAverageQuantity": 0
}
```

## API

- `GET /health`
- `GET /v1/stores`
- `GET /v1/forecasts?storeId=1&date=2026-06-19`
- `POST /v1/forecasts/generate` generates tomorrow
- `POST /v1/forecasts/generate?date=2026-06-19` generates a specific date

## Scripts

```bash
cd apps/forecast-api && npm run build
cd apps/forecast-web && npm run build
```
