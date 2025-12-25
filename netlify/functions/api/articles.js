const articles = [
  {
    id: 1,
    title: "The Future of AI in Content Creation",
    original_content: "Artificial Intelligence is revolutionizing how we create and consume content. From automated writing to image generation, AI tools are becoming increasingly sophisticated.",
    updated_content: "Artificial intelligence is fundamentally transforming the landscape of content creation and consumption. Advanced AI-powered tools now enable automated writing, sophisticated image generation, and intelligent content optimization, marking a paradigm shift in digital media production.",
    status: "ENHANCED",
    citations: [
      {
        url: "https://techcrunch.com/2024/ai-content-creation",
        title: "AI Content Creation Tools See Unprecedented Adoption",
        snippet: "AI content creation tools are seeing unprecedented adoption rates across industries..."
      },
      {
        url: "https://mit.edu/ai-research-2024", 
        title: "MIT Researchers Demonstrate Breakthrough in AI",
        snippet: "MIT researchers demonstrate breakthrough in AI-generated content quality..."
      }
    ],
    created_at: "2024-01-15T10:00:00Z",
    updated_at: "2024-01-15T12:00:00Z"
  },
  {
    id: 2,
    title: "Building Scalable Web Applications",
    original_content: "Scalability is crucial for modern web applications. As user bases grow, applications must handle increased load without compromising performance.",
    updated_content: null,
    status: "PENDING",
    citations: [],
    created_at: "2024-01-16T09:00:00Z",
    updated_at: "2024-01-16T09:00:00Z"
  }
];

exports.handler = async (event, context) => {
  const { httpMethod, path, body } = event;
  
  // Handle CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS'
  };

  if (httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    if (httpMethod === 'GET' && path === '/api/articles') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(articles)
      };
    }

    if (httpMethod === 'PUT' && path.startsWith('/api/articles/')) {
      const id = parseInt(path.split('/').pop());
      const updatedArticle = JSON.parse(body);
      
      const articleIndex = articles.findIndex(a => a.id === id);
      if (articleIndex === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Article not found' })
        };
      }
      
      articles[articleIndex] = { ...articles[articleIndex], ...updatedArticle };
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(articles[articleIndex])
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Not found' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' })
    };
  }
};
