const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require('cheerio');
const OpenAI = require('openai');

// Configuration
const LARAVEL_API_BASE = 'http://localhost:8000/api';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-openai-api-key-here';

// Initialize OpenAI client
const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
});

/**
 * Fetch the latest unprocessed article from Laravel
 */
async function fetchLatestArticle() {
    try {
        const response = await axios.get(`${LARAVEL_API_BASE}/articles`);
        const articles = response.data;
        
        // Find article that hasn't been processed yet (no updated_content)
        const unprocessedArticle = articles.find(article => !article.updated_content);
        
        if (!unprocessedArticle) {
            console.log('No unprocessed articles found.');
            return null;
        }
        
        return unprocessedArticle;
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        throw error;
    }
}

/**
 * Search Google for related content using Puppeteer
 */
async function searchGoogle(query) {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
        
        const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&num=5`;
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });
        
        // Extract search result links
        const links = await page.evaluate(() => {
            const results = [];
            const searchResults = document.querySelectorAll('div.g');
            
            for (let i = 0; i < Math.min(searchResults.length, 3); i++) {
                const result = searchResults[i];
                const linkElement = result.querySelector('a');
                if (linkElement && linkElement.href) {
                    const href = linkElement.href;
                    // Skip Google internal links
                    if (!href.includes('google.com') && href.startsWith('http')) {
                        results.push(href);
                    }
                }
            }
            
            return results;
        });
        
        await browser.close();
        return links;
    } catch (error) {
        if (browser) await browser.close();
        console.error('Error searching Google:', error.message);
        return [];
    }
}

/**
 * Scrape content from a URL
 */
async function scrapeContent(url) {
    try {
        const response = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            },
            timeout: 10000
        });
        
        const $ = cheerio.load(response.data);
        
        // Remove script and style elements
        $('script, style, nav, header, footer, aside').remove();
        
        // Extract text content from main content areas
        let content = '';
        
        // Try different selectors for main content
        const contentSelectors = [
            'main', 
            'article', 
            '.content', 
            '.post-content',
            '.entry-content',
            'body'
        ];
        
        for (const selector of contentSelectors) {
            const element = $(selector);
            if (element.length > 0) {
                content = element.text().trim();
                if (content.length > 200) break;
            }
        }
        
        // If no specific content found, get body text
        if (!content) {
            content = $('body').text().trim();
        }
        
        // Clean up the content
        content = content
            .replace(/\s+/g, ' ')
            .replace(/\n+/g, ' ')
            .substring(0, 1500); // Limit to first 1500 characters
        
        return content;
    } catch (error) {
        console.error(`Error scraping ${url}:`, error.message);
        return '';
    }
}

/**
 * Process content using OpenAI
 */
async function processWithAI(originalContent, externalContext, title) {
    try {
        if (!OPENAI_API_KEY || OPENAI_API_KEY === 'your-openai-api-key-here') {
            console.log('OpenAI API key not configured. Using placeholder content.');
            return `[AI GENERATED PLACEHOLDER] Enhanced version of "${title}"\n\nOriginal content has been analyzed and improved with additional context from external sources. The updated content includes:\n\n- Enhanced accuracy and detail\n- Additional insights from recent sources\n- Improved structure and readability\n- Fact-checked information\n\n${originalContent.substring(0, 500)}... [Content would be processed by OpenAI API]`;
        }
        
        const prompt = `Please rewrite and enhance the following article using the provided external sources for additional context and accuracy. Maintain the original message but improve it with:

1. More current information from the external sources
2. Better structure and readability
3. Additional insights and perspectives
4. Fact-checking and accuracy improvements

Original Article Title: ${title}

Original Content:
${originalContent}

External Sources Context:
${externalContext}

Please provide an enhanced version that combines the best of both sources while maintaining accuracy and adding value.`;

        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a skilled content editor and researcher. Your task is to enhance articles by incorporating information from external sources while maintaining the original message and improving accuracy, readability, and value."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 1500,
            temperature: 0.7,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        console.error('Error processing with OpenAI:', error.message);
        return `[AI PROCESSING ERROR] Could not process content with AI. Original content preserved.\n\n${originalContent}`;
    }
}

/**
 * Update article in Laravel with processed content
 */
async function updateArticle(articleId, updatedContent, references) {
    try {
        const response = await axios.put(`${LARAVEL_API_BASE}/articles/${articleId}`, {
            updated_content: updatedContent,
            references: references
        });
        
        return response.data;
    } catch (error) {
        console.error('Error updating article:', error.message);
        throw error;
    }
}

/**
 * Main processing function
 */
async function processArticle() {
    console.log('🚀 Starting article processing...');
    
    try {
        // 1. Fetch latest unprocessed article
        const article = await fetchLatestArticle();
        if (!article) {
            console.log('✅ No articles to process. All done!');
            return;
        }
        
        console.log(`📖 Processing article: "${article.title}"`);
        
        // 2. Search Google for related content
        console.log('🔍 Searching Google for related content...');
        const searchLinks = await searchGoogle(article.title);
        console.log(`Found ${searchLinks.length} relevant links`);
        
        // 3. Scrape content from the links
        console.log('🕷️  Scraping content from external sources...');
        let externalContext = '';
        const validReferences = [];
        
        for (let i = 0; i < searchLinks.length; i++) {
            const link = searchLinks[i];
            console.log(`  Scraping source ${i + 1}: ${link}`);
            
            const content = await scrapeContent(link);
            if (content && content.length > 100) {
                externalContext += `\n\nSource ${i + 1} (${link}):\n${content}`;
                validReferences.push({
                    url: link,
                    title: `Source ${i + 1}`,
                    snippet: content.substring(0, 200) + '...'
                });
            }
        }
        
        // 4. Process with AI
        console.log('🤖 Processing content with AI...');
        const updatedContent = await processWithAI(
            article.content,
            externalContext,
            article.title
        );
        
        // 5. Update Laravel
        console.log('💾 Updating article in database...');
        await updateArticle(article.id, updatedContent, validReferences);
        
        console.log('✅ Article processed successfully!');
        console.log(`📊 Summary:`);
        console.log(`   - Original title: ${article.title}`);
        console.log(`   - Sources found: ${validReferences.length}`);
        console.log(`   - Content enhanced: ${updatedContent.length > article.content.length ? 'Yes' : 'No'}`);
        
    } catch (error) {
        console.error('❌ Error in processing:', error.message);
    }
}

// Run the processor
if (require.main === module) {
    processArticle()
        .then(() => {
            console.log('🎉 Processing complete!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { processArticle, fetchLatestArticle, searchGoogle, scrapeContent };
