-- Обновление видео на рабочие ссылки
-- Используем универсальное спортивное видео как placeholder

UPDATE t_p40618121_yenisei_sport_hall_1.sports 
SET video = 'https://rutube.ru/play/embed/c962995dacda81de0043a2cf3009661b', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'handball';

UPDATE t_p40618121_yenisei_sport_hall_1.sports 
SET video = 'https://rutube.ru/play/embed/018193bdb5fa4ce67cbef5c867181781', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'futsal';

UPDATE t_p40618121_yenisei_sport_hall_1.sports 
SET video = 'https://rutube.ru/play/embed/d5bbf6ef66b9b07ed0d6e3746b19cfd7', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'volleyball';

UPDATE t_p40618121_yenisei_sport_hall_1.sports 
SET video = 'https://rutube.ru/play/embed/4bc3b5e3f3ad68e1b98e23e87ab8ca32', updated_at = CURRENT_TIMESTAMP 
WHERE id = 'floorball';