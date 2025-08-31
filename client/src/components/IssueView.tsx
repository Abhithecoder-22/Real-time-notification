import { CommentCard } from "./CommentCard";
import { CommentForm } from "./CommentForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectionStatus } from "./ConnectionStatus";
import { useWebSocket } from "@/hooks/use-websocket";
import { MessageCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { useEffect, useState } from "react";

interface IssueViewProps {
  issueId: string;
}

export function IssueView({ issueId }: IssueViewProps) {
  const { 
    isConnected, 
    isConnecting, 
    lastError, 
    comments, 
    connect 
  } = useWebSocket(issueId);
  
  const [newCommentIds, setNewCommentIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Track new comments for animation
    const latestComment = comments[comments.length - 1];
    if (latestComment && comments.length > 2) { // Initial 2 are mock data
      setNewCommentIds(prev => new Set([...prev, latestComment.id]));
      
      // Remove "new" status after animation
      setTimeout(() => {
        setNewCommentIds(prev => {
          const updated = new Set(prev);
          updated.delete(latestComment.id);
          return updated;
        });
      }, 3000);
    }
  }, [comments]);

  const issue = {
    id: issueId,
    title: "Implement real-time notifications system",
    description: "Add WebSocket support for live comment updates on issue pages. Include health checks and auto-reconnection.",
    status: "In Progress",
    priority: "High",
    assignee: "Development Team"
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Issue Header */}
      <Card className="shadow-elegant">
        <CardHeader className="bg-gradient-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl">{issue.title}</CardTitle>
                <p className="text-sm text-muted-foreground">#{issue.id}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary" 
                className="bg-warning/10 text-warning border-warning/20"
              >
                {issue.status}
              </Badge>
              <Badge 
                variant="secondary" 
                className="bg-destructive/10 text-destructive border-destructive/20"
              >
                {issue.priority}
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-6">
          <p className="text-muted-foreground mb-4">{issue.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4" />
              Assigned to {issue.assignee}
            </div>
            
            <ConnectionStatus 
              isConnected={isConnected}
              isConnecting={isConnecting}
              lastError={lastError}
              onReconnect={connect}
            />
          </div>
        </CardContent>
      </Card>

      {/* Comments Section */}
      <Card className="shadow-elegant">
        <CardHeader>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-primary" />
            <CardTitle>Comments ({comments.length})</CardTitle>
            {isConnected && (
              <Badge variant="secondary" className="bg-success/10 text-success border-success/20 text-xs">
                Live
              </Badge>
            )}
          </div>
        </CardHeader>
        
        <Separator />
        
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="p-6 space-y-4">
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No comments yet. Start the conversation!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentCard 
                    key={comment.id} 
                    comment={comment}
                    isNew={newCommentIds.has(comment.id)}
                  />
                ))
              )}
              {/* Add Comment Form */}
              <div className="pt-6">
                <CommentForm issueId={issueId} />
              </div>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}