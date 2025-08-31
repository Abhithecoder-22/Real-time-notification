"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
exports.app = app;
const server = http_1.default.createServer(app);
exports.server = server;
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
});
const comments = [];
// Add comment endpoint
app.post('/api/issues/:issueId/comments', (req, res) => {
    const { issueId } = req.params;
    const { text } = req.body;
    const comment = {
        id: Math.random().toString(36).slice(2),
        issueId,
        text,
        createdAt: new Date().toISOString()
    };
    comments.push(comment);
    io.to(issueId).emit('new_comment', comment);
    res.status(201).json(comment);
});
// Socket.io connection
io.on('connection', (socket) => {
    socket.on('join_issue', (issueId) => {
        socket.join(issueId);
    });
});
