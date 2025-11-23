CREATE TABLE IF NOT EXISTS t_p40618121_yenisei_sport_hall_1.feedback_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_created_at ON t_p40618121_yenisei_sport_hall_1.feedback_messages(created_at DESC);