DROP TABLE IF EXISTS sales_forecasts;
DROP TABLE IF EXISTS sales;
DROP TABLE IF EXISTS store_products;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS stores;

CREATE TABLE stores (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  city TEXT NOT NULL,
  address TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE store_products (
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (store_id, product_id)
);

CREATE TABLE sales (
  id BIGSERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sold_at TIMESTAMPTZ NOT NULL,
  quantity INT NOT NULL CHECK (quantity >= 0)
);

CREATE TABLE sales_forecasts (
  id BIGSERIAL PRIMARY KEY,
  store_id INT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  forecast_date DATE NOT NULL,
  forecast_hour INT NOT NULL CHECK (forecast_hour >= 0 AND forecast_hour <= 23),
  predicted_quantity NUMERIC(10, 2) NOT NULL CHECK (predicted_quantity >= 0),
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  algorithm TEXT NOT NULL DEFAULT 'hourly_average',
  UNIQUE (store_id, product_id, forecast_date, forecast_hour)
);

CREATE INDEX idx_sales_lookup ON sales (store_id, product_id, sold_at);
CREATE INDEX idx_forecasts_lookup ON sales_forecasts (store_id, forecast_date, forecast_hour);

INSERT INTO stores (name, city, address) VALUES
  ('KFC Dizengoff', 'Tel Aviv', 'Dizengoff 99'),
  ('KFC Cinema City', 'Rishon LeZion', 'Moshe Dayan 32'),
  ('KFC Mamilla', 'Jerusalem', 'Yitzhak Kariv 6');

INSERT INTO products (name, category) VALUES
  ('Original Recipe Bucket', 'Chicken'),
  ('Zinger Burger', 'Burger'),
  ('Hot Wings', 'Chicken'),
  ('Popcorn Chicken', 'Chicken'),
  ('Fries', 'Side');

INSERT INTO store_products (store_id, product_id)
SELECT s.id, p.id
FROM stores s
CROSS JOIN products p;

INSERT INTO sales (store_id, product_id, sold_at, quantity)
SELECT
  sp.store_id,
  sp.product_id,
  (day_value::date + make_interval(hours => hour_value)) AT TIME ZONE 'Asia/Jerusalem',
  GREATEST(
    0,
    (
      4
      + (sp.store_id * 2)
      + p.id
      + CASE WHEN hour_value BETWEEN 11 AND 14 THEN 9 ELSE 0 END
      + CASE WHEN hour_value BETWEEN 18 AND 21 THEN 13 ELSE 0 END
      + CASE WHEN EXTRACT(ISODOW FROM day_value) IN (5, 6) THEN 5 ELSE 0 END
      + ((EXTRACT(DAY FROM day_value)::int + hour_value + p.id) % 4)
    )
  )::int
FROM store_products sp
JOIN products p ON p.id = sp.product_id
CROSS JOIN generate_series(CURRENT_DATE - INTERVAL '21 days', CURRENT_DATE - INTERVAL '1 day', INTERVAL '1 day') AS day_value
CROSS JOIN generate_series(8, 22) AS hour_value;

