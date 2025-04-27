const { extractContentFromUrl, generateSummary } = require('../services/summaryService');

// Mock axios and cheerio for the extractContentFromUrl function
jest.mock('axios');
jest.mock('cheerio', () => ({
  load: jest.fn().mockReturnValue({
    text: jest.fn().mockReturnValue('Sample Title'),
    remove: jest.fn(),
    first: jest.fn().mockReturnValue({
      text: jest.fn().mockReturnValue('Sample Title')
    }),
    map: jest.fn().mockReturnValue({
      get: jest.fn().mockReturnValue(['Paragraph 1', 'Paragraph 2'])
    })
  })
}));

// Mock OpenAI API for the generateSummary function
jest.mock('openai', () => {
  return jest.fn().mockImplementation(() => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [
              {
                message: {
                  content: 'This is a test summary of the article.'
                }
              }
            ]
          })
        }
      }
    };
  });
});

describe('Summary Service', () => {
  // Reset all mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('extractContentFromUrl', () => {
    it('should extract content from a URL', async () => {
      const mockHtmlResponse = '<html><head><title>Sample Title</title></head><body><p>Paragraph 1</p><p>Paragraph 2</p></body></html>';
      
      // Set up axios mock to return the HTML
      require('axios').get.mockResolvedValue({ data: mockHtmlResponse });

      const result = await extractContentFromUrl('https://example.com/article');
      
      expect(result).toHaveProperty('title');
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('wordCount');
    });

    it('should handle errors when extracting content', async () => {
      // Set up axios mock to throw an error
      require('axios').get.mockRejectedValue(new Error('Failed to fetch URL'));

      await expect(extractContentFromUrl('https://example.com/article')).rejects.toThrow();
    });
  });

  describe('generateSummary', () => {
    it('should generate a summary using OpenAI', async () => {
      const result = await generateSummary('Test Title', 'This is the content of the article. It has multiple sentences and paragraphs that need to be summarized.');
      
      expect(result).toHaveProperty('summaryText');
      expect(result).toHaveProperty('summaryWordCount');
      expect(result.summaryText).toBe('This is a test summary of the article.');
    });
  });
}); 