-- Phase 3 schema (MySQL 8+): social publisher (Facebook, Instagram, YouTube)

CREATE TABLE IF NOT EXISTS social_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform ENUM('facebook','instagram','youtube') NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  platform_account_id VARCHAR(255) NOT NULL,
  access_token_enc TEXT NOT NULL,
  refresh_token_enc TEXT NULL,
  token_expires_at DATETIME NULL,
  meta JSON NULL,
  connected_by INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_platform_account (platform, platform_account_id),
  FOREIGN KEY (connected_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS social_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  caption TEXT NULL,
  post_type ENUM('text','photo','video','reel') NOT NULL DEFAULT 'photo',
  media_id INT NULL,
  status ENUM('publishing','completed','failed','partial') NOT NULL DEFAULT 'publishing',
  created_by INT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS social_post_targets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  account_id INT NOT NULL,
  platform ENUM('facebook','instagram','youtube') NOT NULL,
  status ENUM('pending','publishing','success','failed') NOT NULL DEFAULT 'pending',
  platform_post_id VARCHAR(255) NULL,
  platform_post_url VARCHAR(500) NULL,
  error_message VARCHAR(1000) NULL,
  attempted_at DATETIME NULL,
  FOREIGN KEY (post_id) REFERENCES social_posts(id) ON DELETE CASCADE,
  FOREIGN KEY (account_id) REFERENCES social_accounts(id) ON DELETE CASCADE,
  INDEX idx_post (post_id)
) ENGINE=InnoDB;
