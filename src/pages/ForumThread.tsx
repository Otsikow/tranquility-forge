import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  MessageCircle, 
  Share2, 
  Flag, 
  ArrowLeft,
  Send
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

export default function ForumThread() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Mock data - replace with actual API call
  const post = {
    id,
    title: "Tips for managing morning anxiety",
    content: "I've been struggling with anxiety when I wake up. Does anyone have strategies that work for them? I've tried meditation but it doesn't always help.",
    author: {
      name: "Sarah M.",
      isAnonymous: false,
      initials: "SM"
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    likes: 24,
    commentCount: 8,
    tags: ["anxiety", "morning-routine", "self-care"]
  };

  const comments = [
    {
      id: "1",
      author: { name: "Alex K.", initials: "AK" },
      content: "I find that journaling right when I wake up helps me process those anxious thoughts before they spiral. Just 5 minutes can make a difference.",
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      likes: 12
    },
    {
      id: "2",
      author: { name: "Anonymous", initials: "?" },
      content: "Progressive muscle relaxation has been a game changer for me. I work through each muscle group before getting out of bed.",
      createdAt: new Date(Date.now() - 45 * 60 * 1000),
      likes: 8
    },
    {
      id: "3",
      author: { name: "Jordan P.", initials: "JP" },
      content: "Have you tried box breathing? 4 counts in, hold 4, out 4, hold 4. It helps calm my nervous system.",
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      likes: 15
    }
  ];

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    toast({
      title: "Comment posted",
      description: "Your comment has been added to the discussion.",
    });
    setNewComment("");
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar 
        title="Forum Post" 
        leftAction={
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
        }
      />

      <div className="max-w-3xl mx-auto p-4 space-y-6">
        {/* Original Post */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Avatar>
                <AvatarFallback>{post.author.initials}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold">{post.author.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(post.createdAt, { addSuffix: true })}
                    </p>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold mb-3">{post.title}</h1>
              <p className="text-foreground/90 leading-relaxed">{post.content}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <Separator />

            <div className="flex items-center gap-6">
              <Button variant="ghost" size="sm" className="gap-2">
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                <span>{post.commentCount}</span>
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">{comments.length} Comments</h2>

          {comments.map((comment) => (
            <Card key={comment.id}>
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{comment.author.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="font-semibold text-sm">{comment.author.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                    <p className="text-sm leading-relaxed">{comment.content}</p>
                    <div className="flex items-center gap-4">
                      <Button variant="ghost" size="sm" className="gap-2 h-8">
                        <Heart className="h-3 w-3" />
                        <span className="text-xs">{comment.likes}</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2 h-8">
                        <MessageCircle className="h-3 w-3" />
                        <span className="text-xs">Reply</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Comment */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Textarea
              placeholder="Share your thoughts or experiences..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="rounded"
                />
                Post anonymously
              </label>
              <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                <Send className="h-4 w-4 mr-2" />
                Post Comment
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
