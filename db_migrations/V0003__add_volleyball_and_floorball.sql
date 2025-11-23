-- Добавление волейбола и флорбола
INSERT INTO t_p40618121_yenisei_sport_hall_1.sports (id, name, image, video, display_order) 
VALUES 
  ('volleyball', 'Волейбол', 'https://cdn.poehali.dev/projects/a9506489-63c9-42b2-9de9-54615ceeaf14/files/f571584e-2fe2-43d9-b3d1-5e1d1d9022cf.jpg', 'https://rutube.ru/play/embed/d8a7b6c5e4f3g2h1i0j9k8l7m6n5o4p3', 4),
  ('floorball', 'Флорбол', 'https://cdn.poehali.dev/projects/a9506489-63c9-42b2-9de9-54615ceeaf14/files/e8d11747-08f6-44e4-bb11-f5a32dab2853.jpg', 'https://rutube.ru/play/embed/e9f8g7h6i5j4k3l2m1n0o9p8q7r6s5t4', 5);

-- Правила волейбола
INSERT INTO t_p40618121_yenisei_sport_hall_1.sport_rules (sport_id, rule_text, display_order) 
VALUES 
  ('volleyball', 'Игра состоит из 5 партий до 25 очков', 1),
  ('volleyball', 'Команда состоит из 6 игроков на площадке', 2),
  ('volleyball', 'Цель - перебить мяч через сетку на сторону соперника', 3),
  ('volleyball', 'Максимум 3 касания мяча на одной стороне', 4),
  ('volleyball', 'Нельзя касаться сетки во время игры', 5);

-- Техника безопасности волейбола
INSERT INTO t_p40618121_yenisei_sport_hall_1.sport_safety (sport_id, safety_text, display_order) 
VALUES 
  ('volleyball', 'Используйте наколенники для защиты суставов', 1),
  ('volleyball', 'Обувь должна быть с хорошей амортизацией', 2),
  ('volleyball', 'Разминка и растяжка обязательны', 3),
  ('volleyball', 'Не наступайте на среднюю линию', 4),
  ('volleyball', 'Координируйте действия с партнерами', 5);

-- Правила флорбола
INSERT INTO t_p40618121_yenisei_sport_hall_1.sport_rules (sport_id, rule_text, display_order) 
VALUES 
  ('floorball', 'Игра состоит из 3 периодов по 20 минут', 1),
  ('floorball', 'Команда состоит из 6 игроков (5 полевых + вратарь)', 2),
  ('floorball', 'Цель - забить мяч клюшкой в ворота соперника', 3),
  ('floorball', 'Запрещено поднимать клюшку выше колена', 4),
  ('floorball', 'Нельзя играть без клюшки и толкать соперника', 5);

-- Техника безопасности флорбола
INSERT INTO t_p40618121_yenisei_sport_hall_1.sport_safety (sport_id, safety_text, display_order) 
VALUES 
  ('floorball', 'Используйте защитные очки', 1),
  ('floorball', 'Вратарь должен иметь полную защиту', 2),
  ('floorball', 'Обувь с нескользящей подошвой обязательна', 3),
  ('floorball', 'Не размахивайте клюшкой на уровне головы', 4),
  ('floorball', 'Следите за положением клюшки других игроков', 5);