import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Search,
  Plus,
  Heart,
  MessageSquare,
  Eye,
  Pin,
  Brain,
  ClipboardList,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ForumCategory, ForumPost } from "@/types/db";

export default function Community() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [recentPosts, setRecentPosts] = useState<ForumPost[]>([]);
  const [trendingPosts, setTrendingPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) navigate("/auth/login");
    })();
    loadCommunityData();
  }, [navigate]);

  const loadCommunityData = async () => {
    try {
      setLoading(true);

      const { data: categoriesData } = await supabase
        .from("forum_categories")
        .select("*")
        .order("sort_order");
      if (categoriesData) setCategories(categoriesData);

      const { data: recentPostsData } = await supabase
        .from("forum_posts")
        .select(
          `*, profile:users_profile(display_name, avatar_url),
          category:forum_categories(name, color, icon)`
        )
        .order("created_at", { ascending: false })
        .limit(10);
      if (recentPostsData) setRecentPosts(recentPostsData as any);

      const { data: trendingPostsData } = await supabase
        .from("forum_posts")
        .select(
          `*, profile:users_profile(display_name, avatar_url),
          category:forum_categories(name, color, icon)`
        )
        .gte(
          "created_at",
          new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
        )
        .order("likes", { ascending: false })
        .limit(5);
      if (trendingPostsData) setTrendingPosts(trendingPostsData as any);
    } catch (error) {
      console.error("Error loading community data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );
    if (diffInHours < 1) return "Just now";
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

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Community" showBack backTo="/dashboard" />

      <div className="px-6 py-6 space-y-6 max-w-3xl mx-auto">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts, topics, or people..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quick Tools */}
        <Card className="bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              Tools & Resources
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="ghost"
                className="h-16 justify-start gap-3"
                onClick={() => navigate("/cbt")}
              >
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">CBT Tools</div>
                  <div className="text-sm text-muted-foreground">
                    Cognitive behavioral therapy
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>

              <Button
                variant="ghost"
                className="h-16 justify-start gap-3"
                onClick={() => navigate("/assessments")}
              >
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                  <ClipboardList className="h-5 w-5 text-white" />
                </div>
                <div className="text-left">
                  <div className="font-medium">Assessments</div>
                  <div className="text-sm text-muted-foreground">
                    Mental health check-ins
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="categories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="trending">Trending</TabsTrigger>
          </TabsList>

          {/* Categories */}
          <TabsContent value="categories" className="space-y-4">
            {categories.map((category) => (
              <Card key={category.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: category.color + "20" }}
                    >
                      <MessageCircle
                        className="h-5 w-5"
                        style={{ color: category.color }}
                      />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{category.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {category.description}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to={`/community/category/${category.id}`}>
                        View Posts
                      </Link>
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>

          {/* Recent Posts */}
          <TabsContent value="recent" className="space-y-4">
            {recentPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <MessageSquare className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: post.category?.color + "20",
                            color: post.category?.color,
                          }}
                        >
                          {post.category?.name}
                        </Badge>
                        {post.is_pinned && (
                          <Pin className="h-3 w-3 text-muted-foreground" />
                        )}
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{post.profile?.display_name || "Anonymous"}</span>
                        <span>{formatTimeAgo(post.created_at)}</span>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{post.replies_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.views}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Trending Posts */}
          <TabsContent value="trending" className="space-y-4">
            {trendingPosts.map((post, index) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-orange-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="outline"
                          className="text-orange-600 border-orange-200"
                        >
                          #{index + 1} Trending
                        </Badge>
                        <Badge
                          variant="secondary"
                          style={{
                            backgroundColor: post.category?.color + "20",
                            color: post.category?.color,
                          }}
                        >
                          {post.category?.name}
                        </Badge>
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{post.profile?.display_name || "Anonymous"}</span>
                        <span>{formatTimeAgo(post.created_at)}</span>
                        <div className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          <span>{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageSquare className="h-3 w-3" />
                          <span>{post.replies_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
