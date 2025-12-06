CREATE TABLE IF NOT EXISTS partners (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    url VARCHAR(512) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO partners (name, url, display_order) VALUES 
    ('Министерство спорта РФ', 'https://minsport.gov.ru/', 1),
    ('Министерство спорта Красноярского края', 'http://kraysport.ru/', 2),
    ('Правительство Красноярского края', 'http://www.krskstate.ru/', 3)
ON CONFLICT DO NOTHING;