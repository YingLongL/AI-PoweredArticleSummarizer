import { useEffect, useState } from 'react';
import api from '../services/api';

function SavedSummariesPage() {
  const [summaries, setSummaries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSummaries = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You must be logged in to view saved summaries.');
          return;
        }

        const res = await api.get('/summaries', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setSummaries(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch saved summaries.');
      }
    };

    fetchSummaries();
  }, []);

  return (
    <div>
      <h2>Saved Summaries</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {summaries.length === 0 && !error && (
        <p>No summaries saved yet.</p>
      )}

      {summaries.map((summary) => (
        <div key={summary.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <h3>{summary.title}</h3>
          <p><strong>Original URL:</strong> {summary.originalUrl}</p>
          <p><strong>Summary:</strong> {summary.summaryText}</p>
          <p><small>Saved at: {new Date(summary.created_at).toLocaleString()}</small></p>
        </div>
      ))}
    </div>
  );
}

export default SavedSummariesPage;
