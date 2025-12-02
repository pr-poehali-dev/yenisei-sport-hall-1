-- Создание новой таблицы с нормальными URL вместо base64
CREATE TABLE IF NOT EXISTS gallery_photos_new (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Переименование старой таблицы
ALTER TABLE gallery_photos RENAME TO gallery_photos_old;

-- Переименование новой таблицы
ALTER TABLE gallery_photos_new RENAME TO gallery_photos;

-- Добавление примеров с обычными URL
INSERT INTO gallery_photos (url, title, description) VALUES
('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800', 'Тренировка в зале', 'Групповая тренировка наших спортсменов'),
('https://images.unsplash.com/photo-1571902943202-507ec2618e8f?w=800', 'Борцовский ковёр', 'Профессиональное покрытие для тренировок'),
('https://images.unsplash.com/photo-1517344884509-a0c97ec11bcc?w=800', 'Детская секция', 'Занятия для самых юных спортсменов'),
('https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?w=800', 'Соревнования', 'Наши воспитанники на турнире'),
('https://images.unsplash.com/photo-1552196527-572159d69b2f?w=800', 'Командный дух', 'Тренировки в дружной атмосфере');