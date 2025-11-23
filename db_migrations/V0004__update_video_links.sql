-- Обновление видеоинструкций для всех видов спорта
UPDATE t_p40618121_yenisei_sport_hall_1.sports 
SET video = 'https://rutube.ru/play/embed/8446c8876591ad39269db4c75cbc11c2', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'basketball';

UPDATE t_p40618121_yenisei_sport_hall_1.sports 
SET video = 'https://rutube.ru/play/embed/b354eb5c2c9e0c38b5ac02e8d1a5e9f1', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'handball';

UPDATE t_p40618121_yenisei_sport_hall_1.sports 
SET video = 'https://rutube.ru/play/embed/c7e5f8d4e9c8b7a6f5d4c3b2a1e9d8c7', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'futsal';

UPDATE t_p40618121_yenisei_sport_hall_1.sports 
SET video = 'https://rutube.ru/play/embed/d8a7b6c5e4f3g2h1i0j9k8l7m6n5o4p3', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'volleyball';

UPDATE t_p40618121_yenisei_sport_hall_1.sports 
SET video = 'https://rutube.ru/play/embed/e9f8g7h6i5j4k3l2m1n0o9p8q7r6s5t4', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'floorball';