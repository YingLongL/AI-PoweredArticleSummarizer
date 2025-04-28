// const express = require('express');
// const router = express.Router();
// const db = require('../config/db');
// const { authenticateToken, optionalAuthentication } = require('../middleware/auth');
// const summaryService = require('../services/summaryService');
// const pdfService = require('../services/pdfService');

// // Generate a summary from a URL
// router.post('/summarize', optionalAuthentication, async (req, res) => {
//   console.log('Received summarize request:', req.body);
//   try {
//     const { url } = req.body;
    
//     if (!url) {
//       return res.status(400).json({ message: 'URL is required' });
//     }
    
//     // Extract content from URL
//     const { title, content, wordCount } = await summaryService.extractContentFromUrl(url);
    
//     // Generate summary
//     const { summaryText, summaryWordCount } = await summaryService.generateSummary(title, content);
    
//     // Return the summary data
//     res.status(200).json({
//       title,
//       originalUrl: url,
//       summary: summaryText,
//       originalWordCount: wordCount,
//       summaryWordCount,
//       isAuthenticated: !!req.user // Let client know if user is authenticated
//     });
//   } catch (error) {
//     console.error('Summarization error:', error);
//     res.status(500).json({ message: error.message || 'Failed to generate summary' });
//   }
// });

// // Save a summary (requires authentication)
// router.post('/save', authenticateToken, async (req, res) => {
//   try {
//     const { title, originalUrl, originalContent, summaryText, originalWordCount, summaryWordCount } = req.body;
//     const userId = req.user.id;
    
//     // Insert summary to database
//     const savedSummary = await db.query(
//       `INSERT INTO summaries 
//        (user_id, title, original_url, original_content, summary_text, original_word_count, summary_word_count) 
//        VALUES ($1, $2, $3, $4, $5, $6, $7) 
//        RETURNING id, title, created_at`,
//       [userId, title, originalUrl, originalContent, summaryText, originalWordCount, summaryWordCount]
//     );
    
//     res.status(201).json({
//       message: 'Summary saved successfully',
//       summary: savedSummary.rows[0]
//     });
//   } catch (error) {
//     console.error('Save summary error:', error);
//     res.status(500).json({ message: 'Failed to save summary' });
//   }
// });

// // Get all summaries for a user
// router.get('/', authenticateToken, async (req, res) => {
//   try {
//     const userId = req.user.id;
    
//     const summaries = await db.query(
//       `SELECT id, title, original_url, summary_text, original_word_count, 
//        summary_word_count, created_at
//        FROM summaries 
//        WHERE user_id = $1 
//        ORDER BY created_at DESC`,
//       [userId]
//     );
    
//     res.status(200).json(summaries.rows);
//   } catch (error) {
//     console.error('Get summaries error:', error);
//     res.status(500).json({ message: 'Failed to retrieve summaries' });
//   }
// });

// // Get a specific summary by ID
// router.get('/:id', authenticateToken, async (req, res) => {
//   try {
//     const summaryId = req.params.id;
//     const userId = req.user.id;
    
//     const summary = await db.query(
//       `SELECT * FROM summaries 
//        WHERE id = $1 AND user_id = $2`,
//       [summaryId, userId]
//     );
    
//     if (summary.rows.length === 0) {
//       return res.status(404).json({ message: 'Summary not found' });
//     }
    
//     res.status(200).json(summary.rows[0]);
//   } catch (error) {
//     console.error('Get summary error:', error);
//     res.status(500).json({ message: 'Failed to retrieve summary' });
//   }
// });

// // Generate a PDF from a summary
// router.get('/:id/pdf', authenticateToken, async (req, res) => {
//   try {
//     const summaryId = req.params.id;
//     const userId = req.user.id;
    
//     // Retrieve the summary
//     const summary = await db.query(
//       `SELECT * FROM summaries 
//        WHERE id = $1 AND user_id = $2`,
//       [summaryId, userId]
//     );
    
//     if (summary.rows.length === 0) {
//       return res.status(404).json({ message: 'Summary not found' });
//     }
    
//     const summaryData = summary.rows[0];
    
//     // Generate PDF
//     const pdfBuffer = await pdfService.generatePDF(
//       summaryData.title,
//       summaryData.original_url,
//       summaryData.summary_text,
//       summaryData.original_word_count,
//       summaryData.summary_word_count
//     );
    
//     // Set response headers
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(summaryData.title)}.pdf`);
    
//     // Send PDF file
//     res.send(pdfBuffer);
//   } catch (error) {
//     console.error('PDF generation error:', error);
//     res.status(500).json({ message: 'Failed to generate PDF' });
//   }
// });

// // Delete a summary
// router.delete('/:id', authenticateToken, async (req, res) => {
//   try {
//     const summaryId = req.params.id;
//     const userId = req.user.id;
    
//     // Delete the summary
//     const result = await db.query(
//       'DELETE FROM summaries WHERE id = $1 AND user_id = $2 RETURNING id',
//       [summaryId, userId]
//     );
    
//     if (result.rows.length === 0) {
//       return res.status(404).json({ message: 'Summary not found' });
//     }
    
//     res.status(200).json({ message: 'Summary deleted successfully' });
//   } catch (error) {
//     console.error('Delete summary error:', error);
//     res.status(500).json({ message: 'Failed to delete summary' });
//   }
// });

// module.exports = router; 

const express = require('express');
const router = express.Router();
const { authenticateToken, optionalAuthentication } = require('../middleware/auth');
const summaryService = require('../services/summaryService');
const pdfService = require('../services/pdfService');

// Mocked in-memory summaries storage
let summaries = [];

// Generate a summary from a URL
router.post('/summarize', optionalAuthentication, async (req, res) => {
  console.log('Received summarize request:', req.body);
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ message: 'URL is required' });
    }
    
    // Extract content from URL
    const { title, content, wordCount } = await summaryService.extractContentFromUrl(url);
    
    // Generate summary
    const { summaryText, summaryWordCount } = await summaryService.generateSummary(title, content);
    
    res.status(200).json({
      title,
      originalUrl: url,
      summary: summaryText,
      originalWordCount: wordCount,
      summaryWordCount,
      isAuthenticated: !!req.user
    });
  } catch (error) {
    console.error('Summarization error:', error);
    res.status(500).json({ message: error.message || 'Failed to generate summary' });
  }
});

// Save a summary (mocked)
router.post('/save', authenticateToken, async (req, res) => {
  try {
    const { title, originalUrl, originalContent, summaryText, originalWordCount, summaryWordCount } = req.body;
    const userId = req.user.id;

    const newSummary = {
      id: Date.now(),
      userId,
      title,
      originalUrl,
      originalContent,
      summaryText,
      originalWordCount,
      summaryWordCount,
      created_at: new Date()
    };

    summaries.push(newSummary); // Save to in-memory array

    res.status(201).json({
      message: 'Summary saved successfully (mocked)',
      summary: newSummary
    });
  } catch (error) {
    console.error('Save summary error:', error);
    res.status(500).json({ message: 'Failed to save summary' });
  }
});

// Get all summaries for a user (mocked)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userSummaries = summaries.filter(summary => summary.userId === userId);

    res.status(200).json(userSummaries);
  } catch (error) {
    console.error('Get summaries error:', error);
    res.status(500).json({ message: 'Failed to retrieve summaries' });
  }
});

// Get a specific summary by ID (mocked)
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const summaryId = parseInt(req.params.id);
    const userId = req.user.id;

    const summary = summaries.find(s => s.id === summaryId && s.userId === userId);

    if (!summary) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    res.status(200).json(summary);
  } catch (error) {
    console.error('Get summary error:', error);
    res.status(500).json({ message: 'Failed to retrieve summary' });
  }
});

// Generate a PDF from a summary (mocked)
router.get('/:id/pdf', authenticateToken, async (req, res) => {
  try {
    const summaryId = parseInt(req.params.id);
    const userId = req.user.id;

    const summaryData = summaries.find(s => s.id === summaryId && s.userId === userId);

    if (!summaryData) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    // Generate PDF
    const pdfBuffer = await pdfService.generatePDF(
      summaryData.title,
      summaryData.originalUrl,
      summaryData.summaryText,
      summaryData.originalWordCount,
      summaryData.summaryWordCount
    );

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${encodeURIComponent(summaryData.title)}.pdf`);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Failed to generate PDF' });
  }
});

// Delete a summary (mocked)
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const summaryId = parseInt(req.params.id);
    const userId = req.user.id;

    const index = summaries.findIndex(s => s.id === summaryId && s.userId === userId);

    if (index === -1) {
      return res.status(404).json({ message: 'Summary not found' });
    }

    summaries.splice(index, 1); // Remove from array

    res.status(200).json({ message: 'Summary deleted successfully' });
  } catch (error) {
    console.error('Delete summary error:', error);
    res.status(500).json({ message: 'Failed to delete summary' });
  }
});

module.exports = router;