# AI-Powered Article Summarizer - Backend

This is the backend API for the AI-Powered Article Summarizer application. It extracts content from article URLs, uses OpenAI to generate summaries, and allows users to save and download their summaries.

## Features

- User authentication (register, login)
- Article text extraction using Cheerio.js
- AI-powered summarization using OpenAI API
- PDF generation with PDFKit
- PostgreSQL database integration
- RESTful API endpoints

## Prerequisites

- Node.js (v14 or later)
- PostgreSQL database
- OpenAI API key

## Installation

1. Clone the repository:
```
git clone <repository-url>
cd AI-PoweredArticleSummarizer
```

2. Install dependencies:
```
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
PORT=3001
DATABASE_URL=postgres://postgres:password@localhost:5432/article_summarizer
JWT_SECRET=your_jwt_secret_key_here
OPENAI_API_KEY=your_openai_api_key_here
```

4. Set up the PostgreSQL database:
```
psql -U postgres -f config/schema.sql
```
Or manually create the database and run the SQL commands from `config/schema.sql`.

## Usage

### Start Development Server

```
npm run dev
```

### Start Production Server

```
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user

### Summaries

- `POST /api/summaries/summarize` - Generate a summary from a URL
- `POST /api/summaries/save` - Save a summary (requires authentication)
- `GET /api/summaries` - Get all summaries for a user
- `GET /api/summaries/:id` - Get a specific summary
- `GET /api/summaries/:id/pdf` - Download a summary as PDF
- `DELETE /api/summaries/:id` - Delete a summary

## Example Requests

### Generate a Summary

```json
POST /api/summaries/summarize
{
  "url": "https://example.com/article-to-summarize"
}
```

### Save a Summary

```json
POST /api/summaries/save
{
  "title": "Article Title",
  "originalUrl": "https://example.com/article",
  "originalContent": "Full article content...",
  "summaryText": "Summarized content...",
  "originalWordCount": 1500,
  "summaryWordCount": 300
}
```

## License

MIT 