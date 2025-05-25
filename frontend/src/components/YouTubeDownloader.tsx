import { useState } from 'react';
import './YouTubeDownloader.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

function YouTubeDownloader() {
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!url) {
      setError('Please enter a YouTube URL');
      return;
    }

    setIsLoading(true);
    setError('');
    setStatus('Connecting to server...');

    try {
      const response = await fetch(`${API_URL}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to download video');
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = 'video.mp4';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      setStatus('Download completed!');
      setUrl('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="downloader-container">
      <div className="gradient-accent" />
      <div className="content">
        <h1 className="title">Download YouTube Videos</h1>
        <p className="subtitle">Fast, free, and easy to use.</p>
        
        <div className="input-container">
          <input
            type="text"
            className="url-input"
            placeholder="Paste YouTube URL here"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="download-button"
            onClick={handleDownload}
            disabled={isLoading || !url}
          >
            {isLoading ? 'Downloading...' : 'Download'}
          </button>
          
          {status && !error && (
            <div className={`status ${isLoading ? 'loading' : 'success'}`}>
              {status}
            </div>
          )}
          
          {error && (
            <div className="status error">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default YouTubeDownloader; 