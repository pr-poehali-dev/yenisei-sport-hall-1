-- Создание таблицы для фотогалереи
CREATE TABLE IF NOT EXISTS gallery_photos (
  id SERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индекс для сортировки по дате
CREATE INDEX idx_gallery_photos_created_at ON gallery_photos(created_at DESC);