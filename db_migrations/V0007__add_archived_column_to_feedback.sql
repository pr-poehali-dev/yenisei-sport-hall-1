ALTER TABLE t_p40618121_yenisei_sport_hall_1.feedback_messages
ADD COLUMN is_archived BOOLEAN NOT NULL DEFAULT FALSE;

CREATE INDEX idx_feedback_archived ON t_p40618121_yenisei_sport_hall_1.feedback_messages(is_archived);
