# YouTube Video Downloader

A modern web application for downloading YouTube videos in the highest available quality. Built with React, TypeScript, and Node.js.

## Features

- Download YouTube videos in highest quality
- Modern, responsive UI with dark theme
- Progress tracking during download
- Automatic video format merging

## Tech Stack

- Frontend:
  - React with TypeScript
  - Vite for build tooling
  - Modern CSS with animations
  
- Backend:
  - Node.js with Express
  - yt-dlp for video downloading
  - ffmpeg for video processing

## Prerequisites

- Node.js >= 18.0.0
- ffmpeg (for video processing)
- yt-dlp (installed automatically)

## Setup

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd ../backend
   npm install
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. Start the frontend development server:
   ```bash
   cd ../frontend
   npm run dev
   ```

The application will be available at http://localhost:5173

## Environment Variables

Backend:
- `PORT`: Server port (default: 3000)
- `ALLOWED_ORIGINS`: Comma-separated list of allowed CORS origins

Frontend:
- `VITE_API_URL`: Backend API URL (default: http://localhost:3000)

## License

MIT 