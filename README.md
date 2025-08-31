# Real-Time Issue Tracker

## Setup Instructions

### Backend
1. Navigate to the `server` folder:
   ```sh
   cd server
   ```
2. Install dependencies:
   ```sh
   npm install --legacy-peer-deps
   ```
3. Start the backend server:
   ```sh
   npm run dev
   ```

### Frontend
1. Navigate to the `client` folder:
   ```sh
   cd client
   ```
2. Install dependencies:
   ```sh
   npm install --legacy-peer-deps
   ```
3. Start the frontend dev server:
   ```sh
   npm run dev
   ```

## Features
- Real-time notifications for new comments using WebSocket (Socket.IO)
- Health check endpoint (`/health`) and reconnect strategy
- Add comments to issues with live updates for all clients

## Notes
- Use `npm install --legacy-peer-deps` for both backend and frontend to avoid dependency conflicts.
- No emojis or mock comments are present in the codebase.
