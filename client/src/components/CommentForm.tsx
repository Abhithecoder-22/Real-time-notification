import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

interface CommentFormProps {
  issueId: string;
  onCommentAdded?: () => void;
}

export function CommentForm({ issueId, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim() || !author.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5000/api/issues/${issueId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content, author })
      });
      if (!res.ok) throw new Error("Failed to add comment");
      setContent("");
      if (onCommentAdded) onCommentAdded();
    } catch (err) {
      setError("Failed to add comment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex flex-col md:flex-row gap-2 items-end mt-4" onSubmit={handleSubmit}>
      <Input
        value={author}
        onChange={e => setAuthor(e.target.value)}
        placeholder="Your name"
        className="md:w-40"
        disabled={loading}
      />
      <Input
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Add a comment..."
        className="flex-1"
        disabled={loading}
      />
      <Button type="submit" disabled={loading || !content.trim() || !author.trim()}>
        {loading ? "Adding..." : "Add Comment"}
      </Button>
      {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
    </form>
  );
}
