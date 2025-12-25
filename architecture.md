# BeyondChats Assignment Architecture

## System Architecture Diagram

```mermaid
graph TB
    subgraph "Frontend Layer"
        React[React Frontend<br/>localhost:3000]
    end
    
    subgraph "API Layer"
        Laravel[Laravel API<br/>localhost:8000<br/>MySQL Database]
    end
    
    subgraph "Automation Layer"
        Node[Node.js Worker<br/>Automation Script]
        OpenAI[OpenAI API]
        Google[Google Search]
        Web[Web Scraping]
    end
    
    React -->|HTTP API Calls| Laravel
    Node -->|Fetch Articles| Laravel
    Node -->|Update Articles| Laravel
    Node -->|Search Queries| Google
    Node -->|Scrape Content| Web
    Node -->|Process Content| OpenAI
    
    style React fill:#61dafb
    style Laravel fill:#ff2d20
    style Node fill:#339933
    style OpenAI fill:#412991
    style Google fill:#4285f4
    style Web fill:#ff6b6b
```

## Data Flow

1. **Laravel API (Source of Truth)**
   - MySQL database stores articles
   - RESTful API endpoints for CRUD operations
   - Handles all data persistence

2. **Node.js Automation Worker**
   - Fetches unprocessed articles from Laravel
   - Searches Google for related content
   - Scrapes web pages for additional context
   - Processes content with OpenAI API
   - Updates Laravel with enhanced content and references

3. **React Frontend**
   - Consumes data from Laravel API
   - Displays side-by-side comparison
   - Shows original vs AI-enhanced content
   - Displays reference sources and citations

## Technology Stack

- **Backend**: Laravel 9, MySQL
- **Automation**: Node.js, Puppeteer, Cheerio, OpenAI
- **Frontend**: React 18, Axios, CSS3
- **Deployment**: Monolithic Git repository structure

## Key Features

- **Content Scraping**: Automated article collection
- **AI Enhancement**: OpenAI-powered content rewriting
- **Reference Tracking**: Citation management for sources
- **Real-time Updates**: Live content comparison
- **Responsive Design**: Mobile-friendly interface
