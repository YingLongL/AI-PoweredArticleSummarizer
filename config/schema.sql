-- Create database (run this manually)
-- CREATE DATABASE article_summarizer;

-- Connect to the database (run this manually)
-- \c article_summarizer

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Summaries table
CREATE TABLE IF NOT EXISTS summaries (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  original_url TEXT NOT NULL,
  original_content TEXT,
  summary_text TEXT NOT NULL,
  original_word_count INTEGER,
  summary_word_count INTEGER,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
); 