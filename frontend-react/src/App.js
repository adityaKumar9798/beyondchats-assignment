import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Mock data for demonstration when backend is not available
  const mockArticles = [
    {
      id: 1,
      title: 'The Future of AI in Content Creation',
      content: 'Artificial intelligence is revolutionizing how we create and consume content. From automated writing to image generation, AI tools are becoming increasingly sophisticated. This article explores the current state of AI in content creation and what we can expect in the coming years.',
      source_url: 'https://beyondchats.com/blog/future-ai-content-creation',
      updated_content: 'Artificial intelligence is fundamentally transforming the landscape of content creation and consumption. Recent advances in machine learning and natural language processing have enabled AI systems to generate high-quality written content, create stunning visuals, and even compose music. According to industry reports, the AI content creation market is projected to grow exponentially over the next decade, with applications spanning from journalism to marketing and entertainment.\n\nThe integration of AI tools like GPT-4, DALL-E, and other generative models has democratized content creation, allowing individuals and small businesses to produce professional-grade content without extensive technical expertise. However, this transformation also raises important questions about authenticity, copyright, and the future of creative professions.',
      references: [
        {
          url: 'https://techcrunch.com/2023/ai-content-creation',
          title: 'Source 1',
          snippet: 'AI content creation tools are seeing unprecedented adoption rates...'
        },
        {
          url: 'https://mit.edu/ai-research-2023',
          title: 'Source 2',
          snippet: 'MIT researchers demonstrate breakthrough in AI-generated content quality...'
        }
      ],
      created_at: '2023-12-20T10:00:00Z',
      updated_at: '2023-12-25T15:30:00Z'
    },
    {
      id: 2,
      title: 'Building Scalable Web Applications',
      content: 'Creating web applications that can handle growth requires careful planning and architecture. This guide covers essential principles for building scalable applications, including database optimization, caching strategies, and microservices architecture.',
      source_url: 'https://beyondchats.com/blog/scalable-web-applications',
      updated_content: null,
      references: null,
      created_at: '2023-12-19T14:00:00Z',
      updated_at: '2023-12-19T14:00:00Z'
    }
  ];

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      // Try to fetch from Laravel API first
      const response = await axios.get('http://127.0.0.1:8000/api/articles');
      setArticles(response.data);
      setError(null);
    } catch (err) {
      console.log('Backend not available, using mock data');
      // Fallback to mock data if backend is not available
      setArticles(mockArticles);
      setError('Backend not available - showing demo data');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="App">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading articles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>BeyondChats Content Dashboard</h1>
        <p>AI-Powered Content Enhancement Platform</p>
        {error && <div className="error-banner">{error}</div>}
      </header>

      <main className="main-content">
        <div className="articles-list">
          <h2>Articles ({articles.length})</h2>
          {articles.map(article => (
            <div 
              key={article.id} 
              className={`article-card ${selectedArticle?.id === article.id ? 'selected' : ''}`}
              onClick={() => setSelectedArticle(article)}
            >
              <div className="article-header">
                <h3>{article.title}</h3>
                <div className="article-meta">
                  <span className="date">{formatDate(article.created_at)}</span>
                  {article.updated_content && (
                    <span className="status-badge enhanced">Enhanced</span>
                  )}
                  {!article.updated_content && (
                    <span className="status-badge pending">Pending</span>
                  )}
                </div>
              </div>
              <p className="article-excerpt">
                {article.content.substring(0, 150)}...
              </p>
            </div>
          ))}
        </div>

        {selectedArticle && (
          <div className="article-detail">
            <div className="detail-header">
              <h2>{selectedArticle.title}</h2>
              <button 
                className="close-btn"
                onClick={() => setSelectedArticle(null)}
              >
                ×
              </button>
            </div>

            <div className="comparison-view">
              <div className="content-column original">
                <div className="column-header">
                  <h3>Original Content</h3>
                  <span className="word-count">{selectedArticle.content.split(' ').length} words</span>
                </div>
                <div className="content-text">
                  {selectedArticle.content}
                </div>
                {selectedArticle.source_url && (
                  <div className="source-info">
                    <strong>Source:</strong>
                    <a href={selectedArticle.source_url} target="_blank" rel="noopener noreferrer">
                      {selectedArticle.source_url}
                    </a>
                  </div>
                )}
              </div>

              <div className="divider"></div>

              <div className="content-column updated">
                <div className="column-header">
                  <h3>AI Enhanced Content</h3>
                  {selectedArticle.updated_content ? (
                    <span className="word-count">
                      {selectedArticle.updated_content.split(' ').length} words
                    </span>
                  ) : (
                    <span className="status-badge pending">Pending AI Update</span>
                  )}
                </div>
                <div className="content-text">
                  {selectedArticle.updated_content || (
                    <div className="placeholder-content">
                      <p>This article is pending AI enhancement.</p>
                      <p>The Node.js automation script will process this article by:</p>
                      <ul>
                        <li>Searching Google for related content</li>
                        <li>Scraping information from external sources</li>
                        <li>Processing the content with AI models</li>
                        <li>Updating this article with enhanced content</li>
                      </ul>
                    </div>
                  )}
                </div>

                {selectedArticle.references && selectedArticle.references.length > 0 && (
                  <div className="references-section">
                    <h4>References & Sources</h4>
                    <div className="references-list">
                      {selectedArticle.references.map((ref, index) => (
                        <div key={index} className="reference-item">
                          <div className="reference-title">
                            <strong>{ref.title}</strong>
                          </div>
                          <div className="reference-url">
                            <a href={ref.url} target="_blank" rel="noopener noreferrer">
                              {ref.url}
                            </a>
                          </div>
                          {ref.snippet && (
                            <div className="reference-snippet">
                              "{ref.snippet}"
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {selectedArticle.updated_at !== selectedArticle.created_at && (
              <div className="update-info">
                <strong>Last Updated:</strong> {formatDate(selectedArticle.updated_at)}
              </div>
            )}
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>BeyondChats Assignment - Content Enhancement Platform</p>
      </footer>
    </div>
  );
}

export default App;
