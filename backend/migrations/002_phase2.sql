-- Phase 2 schema (MySQL 8+): analytics, AI chatbot, CRM activities, notifications

CREATE TABLE IF NOT EXISTS analytics_events (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  visitor_id VARCHAR(64) NOT NULL,
  session_id VARCHAR(64) NOT NULL,
  event_type ENUM('pageview') NOT NULL DEFAULT 'pageview',
  path VARCHAR(500) NOT NULL,
  referrer VARCHAR(500) NULL,
  source VARCHAR(160) NULL,
  device ENUM('mobile','tablet','desktop','other') NOT NULL DEFAULT 'other',
  browser VARCHAR(80) NULL,
  os VARCHAR(80) NULL,
  country VARCHAR(80) NULL,
  city VARCHAR(120) NULL,
  ip_hash VARCHAR(64) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_created_at (created_at),
  INDEX idx_visitor (visitor_id),
  INDEX idx_session (session_id),
  INDEX idx_path (path(191))
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chatbot_settings (
  id INT PRIMARY KEY DEFAULT 1,
  enabled TINYINT(1) NOT NULL DEFAULT 1,
  greeting_message VARCHAR(500) NOT NULL DEFAULT 'Hi! I can answer questions about this portfolio. How can I help?',
  system_prompt TEXT NULL,
  model VARCHAR(80) NOT NULL DEFAULT 'gpt-4o-mini',
  lead_capture_enabled TINYINT(1) NOT NULL DEFAULT 1,
  whatsapp_handoff_enabled TINYINT(1) NOT NULL DEFAULT 1,
  updated_by INT NULL,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

INSERT IGNORE INTO chatbot_settings (id) VALUES (1);

CREATE TABLE IF NOT EXISTS chatbot_conversations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  session_id VARCHAR(64) NOT NULL,
  visitor_id VARCHAR(64) NOT NULL,
  lead_id INT NULL,
  started_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_message_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL,
  INDEX idx_session (session_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS chatbot_messages (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  conversation_id INT NOT NULL,
  role ENUM('user','assistant','system') NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (conversation_id) REFERENCES chatbot_conversations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS lead_activities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lead_id INT NOT NULL,
  type ENUM('note','call','email','status_change','follow_up') NOT NULL,
  notes TEXT NULL,
  follow_up_date DATETIME NULL,
  created_by INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type VARCHAR(60) NOT NULL,
  title VARCHAR(255) NOT NULL,
  body VARCHAR(500) NULL,
  link VARCHAR(255) NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_is_read (is_read)
) ENGINE=InnoDB;
