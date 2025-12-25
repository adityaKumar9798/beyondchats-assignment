# BeyondChats Assignment

A monolithic application that demonstrates content scraping, AI-powered rewriting, and web visualization.

**Author:** Aditya Kumar

## Architecture

This project consists of three main components:

1. **backend-laravel/** - Laravel API serving as the source of truth (database)
2. **automation-node/** - Node.js worker that fetches from Laravel, searches Google, scrapes web content, processes with LLM, and updates Laravel
3. **frontend-react/** - React client that displays data from Laravel

## Data Flow

```
Laravel API (Database) ← Node.js Worker ← Google Search ← Web Scraping ← LLM Processing
                                    ↓
                              React Frontend
```

## Setup Instructions

### Prerequisites
- PHP 8+ and Composer
- Node.js and npm
- MySQL or SQLite database
- OpenAI API key (for LLM processing)

### Backend Setup (Laravel)

```bash
cd backend-laravel
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan db:seed --class=ArticleSeeder
php artisan serve
```

The API will be available at `http://localhost:8000`

### Automation Setup (Node.js)

```bash
cd automation-node
npm install
# Set your OpenAI API key in index.js
node index.js
```

### Frontend Setup (React)

```bash
cd frontend-react
npm install
npm start
```

The frontend will be available at `http://localhost:3000`

## API Endpoints

- `GET /api/articles` - Get all articles
- `PUT /api/articles/{id}` - Update an article

## Features

- Scrapes articles from BeyondChats blog
- AI-powered content rewriting using external sources
- Side-by-side comparison of original vs updated content
- Citation tracking for reference sources

## Notes

- The Node.js automation script uses Puppeteer for Google search scraping
- In production, consider using a Search API service instead of direct scraping
- The frontend includes mock data for demonstration when backend is not available
