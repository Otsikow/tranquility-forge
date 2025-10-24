import { useState, useEffect } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, BookOpen, Search, Clock, Bookmark, BookmarkCheck } from "lucide-react";
import { EducationalArticle, UserBookmark } from "@/types/db";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

const CATEGORIES = [
  { value: "all", label: "All Articles" },
  { value: "mindfulness", label: "Mindfulness", icon: "🧘" },
  { value: "cbt", label: "CBT", icon: "🧠" },
  { value: "anxiety", label: "Anxiety", icon: "😰" },
  { value: "depression", label: "Depression", icon: "🌈" },
  { value: "sleep", label: "Sleep", icon: "😴" },
  { value: "stress", label: "Stress", icon: "😌" },
];

export default function Learn() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [articles, setArticles] = useState<EducationalArticle[]>([]);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

      // Load published articles
      const { data: articlesData, error: articlesError } = await supabase
        .from("educational_articles")
        .select("*")
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (articlesError) throw articlesError;

      setArticles(articlesData || []);

      // Load user bookmarks if logged in
      if (user) {
        const { data: bookmarksData, error: bookmarksError } = await supabase
          .from("user_bookmarks")
          .select("article_id")
          .eq("user_id", user.id);

        if (bookmarksError) throw bookmarksError;

        setBookmarks(new Set(bookmarksData.map((b) => b.article_id)));
      }
    } catch (error) {
      console.error("Error loading articles:", error);
      toast({
        title: "Error loading articles",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleBookmark = async (articleId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Please log in to bookmark articles",
          variant: "destructive",
        });
        return;
      }

      if (bookmarks.has(articleId)) {
        // Remove bookmark
        const { error } = await supabase
          .from("user_bookmarks")
          .delete()
          .eq("user_id", user.id)
          .eq("article_id", articleId);

        if (error) throw error;

        setBookmarks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(articleId);
          return newSet;
        });

        toast({
          title: "Bookmark removed",
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from("user_bookmarks")
          .insert({
            user_id: user.id,
            article_id: articleId,
          });

        if (error) throw error;

        setBookmarks((prev) => new Set([...prev, articleId]));

        toast({
          title: "Article bookmarked",
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error updating bookmark",
        variant: "destructive",
      });
    }
  };

  const filteredArticles = articles.filter((article) => {
    const matchesCategory = selectedCategory === "all" || article.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.summary?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getCategoryInfo = (category: string) => {
    return CATEGORIES.find((c) => c.value === category) || { icon: "📚", label: category };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Learn" showBack={false} />

      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Header Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>Mental Health Resources</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Evidence-based articles and guides to support your mental health journey
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {CATEGORIES.map((cat) => (
            <Badge
              key={cat.value}
              variant={selectedCategory === cat.value ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap"
              onClick={() => setSelectedCategory(cat.value)}
            >
              {cat.icon && `${cat.icon} `}{cat.label}
            </Badge>
          ))}
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredArticles.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="pt-12 pb-12 text-center">
                <p className="text-muted-foreground">
                  No articles found. Try a different search or category.
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredArticles.map((article, index) => {
              const categoryInfo = getCategoryInfo(article.category);
              const isBookmarked = bookmarks.has(article.id);

              return (
                <Card
                  key={article.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Cover Image or Gradient */}
                  <div
                    className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                    onClick={() => navigate(`/learn/${article.id}`)}
                  >
                    {article.cover_url ? (
                      <img
                        src={article.cover_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-5xl">{categoryInfo.icon}</div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
                        {categoryInfo.label}
                      </Badge>
                    </div>

                    {/* Bookmark Button */}
                    <div className="absolute top-3 right-3">
                      <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleBookmark(article.id);
                        }}
                      >
                        {isBookmarked ? (
                          <BookmarkCheck className="h-4 w-4 text-primary" />
                        ) : (
                          <Bookmark className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Content */}
                  <CardContent className="pt-4 pb-4" onClick={() => navigate(`/learn/${article.id}`)}>
                    <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.read_time_minutes} min read</span>
                      </div>
                      {article.author && <span>by {article.author}</span>}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
