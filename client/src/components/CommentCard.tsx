import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Comment } from "@/hooks/use-websocket";
import { formatDistanceToNow } from "date-fns";

interface CommentCardProps {
  comment: Comment;
  isNew?: boolean;
}

export function CommentCard({ comment, isNew = false }: CommentCardProps) {
  return (
    <Card className={`p-4 transition-all duration-500 hover:shadow-elegant ${
      isNew ? 'animate-slide-up shadow-glow border-primary/20' : ''
    }`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white text-sm font-medium">
          {comment.author.charAt(0)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-card-foreground">
              {comment.author}
            </span>
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(comment.timestamp), { addSuffix: true })}
            </span>
            {isNew && (
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs px-1.5 py-0.5">
                New
              </Badge>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground leading-relaxed">
            {comment.content}
          </p>
        </div>
      </div>
    </Card>
  );
}