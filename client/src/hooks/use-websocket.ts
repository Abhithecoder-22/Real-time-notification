import { useState, useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useToast } from '@/hooks/use-toast';

export interface Comment {
  id: string;
  issueId: string;
  author: string;
  content: string;
  timestamp: string;
  avatar?: string;
}

export interface WebSocketState {
  isConnected: boolean;
  isConnecting: boolean;
  lastError: string | null;
  comments: Comment[];
}

export function useWebSocket(issueId: string) {
  const [state, setState] = useState<WebSocketState>({
    isConnected: false,
    isConnecting: false,
    lastError: null,
    comments: []
  });
  const socketRef = useRef<Socket | null>(null);
  const { toast } = useToast();

  const connect = useCallback(() => {
    if (socketRef.current) return;
    setState(prev => ({ ...prev, isConnecting: true, lastError: null }));
    const socket = io('http://localhost:5000', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
    });
    socketRef.current = socket;
    socket.on('connect', () => {
      setState(prev => ({ ...prev, isConnected: true, isConnecting: false }));
      socket.emit('join_issue', issueId);
    });
    socket.on('disconnect', () => {
      setState(prev => ({ ...prev, isConnected: false }));
    });
    socket.on('connect_error', () => {
      setState(prev => ({ ...prev, isConnecting: false, lastError: 'Failed to connect' }));
    });
    socket.on('comment', (comment: Comment) => {
      setState(prev => ({ ...prev, comments: [...prev.comments, comment] }));
      toast({
        title: 'New Comment',
        description: `${comment.author}: ${comment.content.slice(0, 50)}${comment.content.length > 50 ? '...' : ''}`,
      });
    });
  }, [issueId, toast]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setState(prev => ({ ...prev, isConnected: false, isConnecting: false }));
  }, []);

  const healthCheck = useCallback(async () => {
    try {
      const res = await fetch('http://localhost:5000/health');
      if (!res.ok) throw new Error('unhealthy');
      return { status: 'healthy' };
    } catch {
      return { status: 'unhealthy' };
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    ...state,
    connect,
    disconnect,
    healthCheck,
  };
}