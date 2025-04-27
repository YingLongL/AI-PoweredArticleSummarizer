const axios = require('axios');
const cheerio = require('cheerio');
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to extract content from a URL
const extractContentFromUrl = async (url) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);
    
    // Remove unwanted elements
    $('script, style, nav, footer, header, aside, .ads, .comments, .sidebar').remove();
    
    // Extract title
    const title = $('title').text().trim() || $('h1').first().text().trim() || 'Untitled Article';
    
    // Extract main content - focusing on article and main content areas
    let content = '';
    
    // Try to find the main content with common selectors
    const contentSelectors = [
      'article', 'main', '.post-content', '.article-content', '.entry-content',
      '.content', '#content', '[itemprop="articleBody"]', '.post-body', '.article-body'
    ];
    
    for (const selector of contentSelectors) {
      const selectedContent = $(selector).text().trim();
      if (selectedContent && selectedContent.length > content.length) {
        content = selectedContent;
      }
    }
    
    // If no content found with selectors, use all paragraphs
    if (!content) {
      content = $('p').map((i, el) => $(el).text().trim()).get().join('\n\n');
    }
    
    // Clean up content
    content = content
      .replace(/\s+/g, ' ')       // Replace multiple spaces with single space
      .replace(/\n\s*\n/g, '\n\n') // Replace multiple newlines with double newlines
      .trim();
    
    const wordCount = content.split(/\s+/).length;
    
    return {
      title,
      content,
      wordCount
    };
  } catch (error) {
    console.error('Error extracting content:', error);
    throw new Error('Failed to extract content from the provided URL');
  }
};

// Function to generate a summary using OpenAI
const generateSummary = async (title, content) => {
  try {
    // For very long content, truncate to avoid token limits
    const maxContentLength = 6000; // Adjust based on your OpenAI model's context window
    const truncatedContent = content.length > maxContentLength
      ? content.substring(0, maxContentLength) + '...'
      : content;
    
    const prompt = `
    Article Title: ${title}
    
    Article Content: ${truncatedContent}
    
    Please provide a concise summary of the above article. The summary should:
    1. Capture the main points and key findings
    2. Be approximately 20% of the original length
    3. Be well-structured and easy to read
    4. Preserve the most important information
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that specializes in summarizing articles accurately while preserving key information."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.5,
      max_tokens: 1000
    });
    
    const summaryText = response.choices[0].message.content.trim();
    const summaryWordCount = summaryText.split(/\s+/).length;
    
    return {
      summaryText,
      summaryWordCount
    };
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error('Failed to generate summary using AI');
  }
};

module.exports = {
  extractContentFromUrl,
  generateSummary
}; 