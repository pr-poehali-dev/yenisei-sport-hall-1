
CREATE TABLE IF NOT EXISTS contacts (
    id SERIAL PRIMARY KEY,
    address TEXT NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL,
    hours TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sports (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    image TEXT NOT NULL,
    video TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sport_rules (
    id SERIAL PRIMARY KEY,
    sport_id VARCHAR(50) NOT NULL REFERENCES sports(id),
    rule_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sport_safety (
    id SERIAL PRIMARY KEY,
    sport_id VARCHAR(50) NOT NULL REFERENCES sports(id),
    safety_text TEXT NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO contacts (address, phone, email, hours) VALUES 
('г. Красноярск, о. Отдыха, 12', '+7 (391) 989-10-82', 'mail@krascsp.ru', 'Ежедневно: 08:00 - 22:00');

INSERT INTO sports (id, name, image, video, display_order) VALUES 
('basketball', 'Баскетбол', 'https://cdn.poehali.dev/projects/a9506489-63c9-42b2-9de9-54615ceeaf14/files/a81ec216-b3dc-426d-bb6d-1824927ff897.jpg', 'https://rutube.ru/play/embed/8446c8876591ad39269db4c75cbc11c2', 1),
('handball', 'Гандбол', 'https://cdn.poehali.dev/projects/a9506489-63c9-42b2-9de9-54615ceeaf14/files/84e8379c-eb4d-4ffa-8bca-6d2993b5498e.jpg', 'https://rutube.ru/play/embed/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6', 2),
('futsal', 'Мини-футбол', 'https://cdn.poehali.dev/files/6c27196a-5bd3-4d6e-ae3c-247391012530.jpg', 'https://rutube.ru/play/embed/b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7', 3);

INSERT INTO sport_rules (sport_id, rule_text, display_order) VALUES 
('basketball', 'Игра состоит из 4 периодов по 10 минут', 1),
('basketball', 'Цель - забросить мяч в кольцо соперника', 2),
('basketball', 'За бросок из-за 3-х очковой линии начисляется 3 очка', 3),
('basketball', 'Запрещены пробежки и двойное ведение', 4),
('basketball', 'Команда состоит из 5 игроков на площадке', 5),
('handball', 'Игра состоит из 2 таймов по 30 минут', 1),
('handball', 'Цель - забросить мяч в ворота соперника', 2),
('handball', 'Команда состоит из 7 игроков (6 полевых + вратарь)', 3),
('handball', 'Можно делать максимум 3 шага с мячом', 4),
('handball', 'Запрещено входить в зону вратаря', 5),
('futsal', 'Игра состоит из 2 таймов по 20 минут', 1),
('futsal', 'Команда состоит из 5 игроков (4 полевых + вратарь)', 2),
('futsal', 'Цель - забить мяч в ворота соперника', 3),
('futsal', 'Замены игроков неограниченны', 4),
('futsal', 'Запрещены подкаты и грубая игра', 5);

INSERT INTO sport_safety (sport_id, safety_text, display_order) VALUES 
('basketball', 'Используйте спортивную обувь с нескользящей подошвой', 1),
('basketball', 'Снимите все украшения перед игрой', 2),
('basketball', 'Разминайтесь перед началом игры', 3),
('basketball', 'Соблюдайте правила игры и не допускайте грубых столкновений', 4),
('basketball', 'При получении травмы немедленно обратитесь к медперсоналу', 5),
('handball', 'Используйте защитные наколенники и налокотники', 1),
('handball', 'Обязательна спортивная обувь', 2),
('handball', 'Вратарь должен использовать специальную защиту', 3),
('handball', 'Разминка перед игрой обязательна', 4),
('handball', 'Соблюдайте дистанцию при бросках', 5),
('futsal', 'Используйте щитки для защиты голени', 1),
('futsal', 'Обувь должна быть специальной для зала', 2),
('futsal', 'Разминка обязательна', 3),
('futsal', 'Не играйте в мокрой обуви', 4),
('futsal', 'Соблюдайте правила честной игры', 5);
