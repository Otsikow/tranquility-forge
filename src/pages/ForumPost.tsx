import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  ArrowLeft, 
  Heart, 
  MessageSquare, 
  Eye, 
  Share2,
  MoreHorizontal,
  Pin,
  Lock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ForumPost, ForumReply, UsersProfile } from "@/types/db";
import { BottomNav } from "@/components/BottomNav";

export default function ForumPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      loadPostAndReplies();
    }
  }, [id]);

  const loadPostAndReplies = async () => {
    try {
      setLoading(true);
      
      // Load post with author and category info
      const { data: postData } = await supabase
        .from('forum_posts')
        .select(`
          *,
          profile:users_profile(display_name, avatar_url),
          category:forum_categories(name, color, icon)
        `)
        .eq('id', id)
        .single();

      if (postData) {
        setPost(postData as any);
        
        // Increment view count
        await supabase
          .from('forum_posts')
          .update({ views: postData.views + 1 })
          .eq('id', id);
      }

      // Load replies with author info
      const { data: repliesData } = await supabase
        .from('forum_replies')
        .select(`
          *,
          profile:users_profile(display_name, avatar_url)
        `)
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (repliesData) {
        setReplies(repliesData as any);
      }
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReply = async () => {
    if (!newReply.trim() || !id) return;

    try {
      setSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('forum_replies')
        .insert({
          post_id: id,
          user_id: user.id,
          content: newReply.trim()
        });

      if (error) throw error;

      setNewReply("");
      loadPostAndReplies(); // Reload to get updated reply count
    } catch (error) {
      console.error('Error submitting reply:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikePost = async () => {
    if (!post) return;

    try {
      const { error } = await supabase
        .from('forum_posts')
        .update({ likes: post.likes + 1 })
        .eq('id', post.id);

      if (error) throw error;

      setPost(prev => prev ? { ...prev, likes: prev.likes + 1 } : null);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
        <BottomNav />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="px-6 py-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-2">Post not found</h2>
              <p className="text-muted-foreground mb-4">This post may have been deleted or doesn't exist.</p>
              <Button asChild>
                <Link to="/community">Back to Community</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/community">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">Post</h1>
          </div>
          <Button variant="ghost" size="icon">
            <Share2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Post */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={post.profile?.avatar_url || ''} />
                <AvatarFallback>
                  {post.profile?.display_name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-foreground">
                    {post.profile?.display_name || 'Anonymous'}
                  </span>
                  <Badge 
                    variant="secondary" 
                    style={{ backgroundColor: post.category?.color + '20', color: post.category?.color }}
                  >
                    {post.category?.name}
                  </Badge>
                  {post.is_pinned && (
                    <Pin className="h-3 w-3 text-muted-foreground" />
                  )}
                  {post.is_locked && (
                    <Lock className="h-3 w-3 text-muted-foreground" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatTimeAgo(post.created_at)}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-xl font-bold text-foreground mb-3">
              {post.title}
            </h2>
            <div className="prose prose-sm max-w-none text-foreground mb-4">
              {post.content.split('\n').map((paragraph, index) => (
                <p key={index} className="mb-2">{paragraph}</p>
              ))}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLikePost}
                className="flex items-center gap-1"
              >
                <Heart className="h-4 w-4" />
                <span>{post.likes}</span>
              </Button>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{post.replies_count}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reply Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Add a Reply</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Share your thoughts..."
                value={newReply}
                onChange={(e) => setNewReply(e.target.value)}
                rows={4}
              />
              <div className="flex justify-end">
                <Button 
                  onClick={handleSubmitReply}
                  disabled={!newReply.trim() || submitting}
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Replies */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Replies ({replies.length})
          </h3>
          {replies.map((reply) => (
            <Card key={reply.id}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={reply.profile?.avatar_url || ''} />
                    <AvatarFallback>
                      {reply.profile?.display_name?.charAt(0) || 'A'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-foreground text-sm">
                        {reply.profile?.display_name || 'Anonymous'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTimeAgo(reply.created_at)}
                      </span>
                    </div>
                    <div className="prose prose-sm max-w-none text-foreground">
                      {reply.content.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-1">{paragraph}</p>
                      ))}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      <Button variant="ghost" size="sm" className="h-6 px-2">
                        <Heart className="h-3 w-3 mr-1" />
                        {reply.likes}
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}