import { useState } from 'react';
import api from '../services/api';

function HomePage() {
  const [url, setUrl] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  const handleSummarize = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSaveMessage('');
    try {
      const res = await api.post('/summaries/summarize', { url });
      setSummary(res.data.summary);
    } catch (err) {
      console.error(err);
      setError('Failed to generate summary.');
    }
    setLoading(false);
  };

  const handleSaveSummary = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('You must be logged in to save summaries.');
        return;
      }

      await api.post('/summaries/save', {
        title: "Mock Title", // Since we mocked summarizer, we don't have real title right now
        originalUrl: url,
        originalContent: "Mock original content.", // optional if you want
        summaryText: summary,
        originalWordCount: 1000, // mock
        summaryWordCount: summary.split(/\s+/).length
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSaveMessage('Summary saved successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to save summary.');
    }
  };

  return (
    <div>
      <h2>Summarize an Article</h2>
      <form onSubmit={handleSummarize}>
        <input
          type="text"
          placeholder="Enter article URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <br />
        <button type="submit">Summarize</button>
      </form>

      {loading && <p>Loading summary...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {saveMessage && <p style={{ color: 'green' }}>{saveMessage}</p>}

      {summary && (
        <div style={{ marginTop: '20px' }}>
          <h3>Summary:</h3>
          <p>{summary}</p>

          {/* Save Summary Button */}
          <button onClick={handleSaveSummary}>Save Summary</button>
        </div>
      )}
    </div>
  );
}

export default HomePage;
  