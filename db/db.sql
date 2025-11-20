-- ============================================
-- Database Schema for Contact Form
-- ============================================
-- This file creates the database and table structure
-- for storing contact form submissions
-- ============================================

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS contact_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- Use the database
USE contact_db;

-- Drop table if exists (for clean reinstall)
-- Comment out this line if you want to preserve existing data
DROP TABLE IF EXISTS contacts;

-- Create contacts table
CREATE TABLE contacts (
    -- Primary key with auto-increment
    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    
    -- Contact information fields
    name VARCHAR(100) NOT NULL COMMENT 'Full name of the contact',
    email VARCHAR(150) NOT NULL COMMENT 'Email address of the contact',
    subject VARCHAR(150) NOT NULL COMMENT 'Subject of the message',
    message TEXT NOT NULL COMMENT 'Message content',
    
    -- Metadata fields
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Timestamp when record was created',
    ip_address VARCHAR(45) NULL COMMENT 'IP address of submitter (optional)',
    user_agent VARCHAR(255) NULL COMMENT 'Browser user agent (optional)',
    status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new' COMMENT 'Status of the contact',
    
    -- Primary key constraint
    PRIMARY KEY (id),
    
    -- Indexes for better query performance
    INDEX idx_email (email),
    INDEX idx_created_at (created_at),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Stores contact form submissions';

-- ============================================
-- Insert sample data for testing
-- ============================================

INSERT INTO contacts (name, email, subject, message, created_at, status) VALUES
(
    'John Doe',
    'john.doe@example.com',
    'Inquiry about services',
    'Hello, I am interested in learning more about your web development services. Could you please provide more information about your pricing and timeline?',
    '2025-01-15 10:30:00',
    'new'
);

-- ============================================
-- Optional: Create admin user table
-- ============================================
-- Uncomment below if you want to create an admin panel

/*
CREATE TABLE IF NOT EXISTS admin_users (
    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    email VARCHAR(150) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    PRIMARY KEY (id),
    INDEX idx_username (username)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
*/

-- ============================================
-- Verification Queries
-- ============================================
-- Run these queries to verify the setup

-- Check if database exists
SHOW DATABASES LIKE 'contact_db';

-- Check table structure
DESCRIBE contacts;

-- Count records in contacts table
SELECT COUNT(*) as total_contacts FROM contacts;

-- View all contacts (limit to 10 for safety)
SELECT id, name, email, subject, created_at, status 
FROM contacts 
ORDER BY created_at DESC 
LIMIT 10;

-- ============================================
-- Useful Queries for Management
-- ============================================

-- Get all new (unread) contacts
-- SELECT * FROM contacts WHERE status = 'new' ORDER BY created_at DESC;

-- Mark a contact as read
-- UPDATE contacts SET status = 'read' WHERE id = 1;

-- Delete old contacts (older than 1 year)
-- DELETE FROM contacts WHERE created_at < DATE_SUB(NOW(), INTERVAL 1 YEAR);

-- Get contact statistics by month
-- SELECT 
--     DATE_FORMAT(created_at, '%Y-%m') as month,
--     COUNT(*) as total_contacts
-- FROM contacts
-- GROUP BY month
-- ORDER BY month DESC;

-- ============================================
-- Security Notes
-- ============================================
-- 1. Always use prepared statements in PHP (PDO or MySQLi)
-- 2. Never store passwords in plain text (use password_hash())
-- 3. Limit database user permissions (don't use root in production)
-- 4. Regular backups are essential
-- 5. Consider adding rate limiting to prevent spam
-- ============================================
