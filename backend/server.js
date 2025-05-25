const express = require('express');
const cors = require('cors');
const validator = require('validator');
const path = require('path');
const fs = require('fs/promises');
const { existsSync } = require('fs');
const { exec } = require('child_process');
const util = require('util');

const execPromise = util.promisify(exec);

const app = express();

// Port configuration
const PORT = process.env.PORT || 3000;

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'https://yt-downloader-git-main-harrys-projects-485c0726.vercel.app'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Create downloads directory if it doesn't exist
const downloadsDir = path.join(__dirname, 'downloads');
if (!existsSync(downloadsDir)) {
  fs.mkdir(downloadsDir, { recursive: true });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Cleanup function for temporary files
async function cleanupFiles(videoPath) {
  try {
    if (existsSync(videoPath)) {
      await fs.unlink(videoPath);
      console.log('Temporary file deleted:', videoPath);
    }
  } catch (error) {
    console.error('Error cleaning up files:', error);
  }
}

app.post('/download', async (req, res) => {
  let videoPath = null;
  
  try {
    const { url } = req.body;
    console.log('Received download request for URL:', url);

    // Validate URL
    if (!url || !validator.isURL(url) || !url.includes('youtube.com') && !url.includes('youtu.be')) {
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // Generate unique filename
    const timestamp = Date.now();
    videoPath = path.join(downloadsDir, `video_${timestamp}.mp4`);

    console.log('Starting download to path:', videoPath);

    // Download and merge video using local yt-dlp
    const ytDlpPath = path.join(__dirname, 'bin', 'yt-dlp');
    const command = `${ytDlpPath} "${url}" -f "bestvideo[ext=mp4]+bestaudio[ext=m4a]" --merge-output-format mp4 -o "${videoPath}"`;
    
    // Execute the command
    const { stdout, stderr } = await execPromise(command);
    console.log('Download output:', stdout);
    
    if (stderr) {
      console.error('Download stderr:', stderr);
    }

    // Check if file exists
    if (!existsSync(videoPath)) {
      throw new Error('Downloaded file not found');
    }

    // Send file to client
    res.sendFile(videoPath, async (err) => {
      if (err) {
        console.error('Error sending file:', err);
      }
      // Clean up after sending
      await cleanupFiles(videoPath);
    });
  } catch (error) {
    console.error('Download error:', error);
    // Clean up on error
    if (videoPath) {
      await cleanupFiles(videoPath);
    }
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 