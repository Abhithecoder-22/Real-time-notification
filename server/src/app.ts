import express, { type Request, type Response } from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

// Health endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({ status: 'ok' });
});

// In-memory issues/comments (for demo)

interface Comment {
  id: string;
  issueId: string;
  author: string;
  content: string;
  timestamp: string;
}

const comments: Comment[] = [];

// Add comment endpoint
app.post('/api/issues/:issueId/comments', (req: Request, res: Response) => {
  const { issueId } = req.params;
  const { author, text } = req.body;
  const comment: Comment = {
    id: Math.random().toString(36).slice(2),
    issueId,
    author: author || 'Anonymous',
    content: text,
    timestamp: new Date().toISOString()
  };
  comments.push(comment);
  io.to(issueId).emit('comment', comment);
  res.status(201).json(comment);
});

// Socket.io connection
io.on('connection', (socket) => {
  socket.on('join_issue', (issueId: string) => {
    socket.join(issueId);
  });
});

export { app, server };
