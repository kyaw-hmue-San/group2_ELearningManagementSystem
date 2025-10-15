-- Initial database setup for E-Learning Management System
-- This file runs automatically when the MySQL container starts for the first time

USE elearning_db;

-- Create a sample table to verify the setup
CREATE TABLE IF NOT EXISTS test_connection (
    id INT AUTO_INCREMENT PRIMARY KEY,
    message VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert a test record
INSERT INTO test_connection (message) VALUES ('Database connection successful!');

-- You can add more initial data here as your project grows
