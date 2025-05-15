-- backend/db/init/
CREATE TABLE IF NOT EXISTS visits (
  id          SERIAL PRIMARY KEY,
  ip          VARCHAR(45) NOT NULL,
  browser_id  TEXT        NOT NULL,
  visited_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
