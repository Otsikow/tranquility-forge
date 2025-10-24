import { useState, useEffect } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MessageSquare, Plus, Search, Heart, TrendingUp, Users } from "lucide-react";
import { CommunityTopic, Challenge } from "@/types/db";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const CATEGORIES = [
  { value: "general", label: "General Discussion", icon: "💬" },
  { value: "sleep", label: "Sleep Tips", icon: "😴" },
  { value: "anxiety", label: "Anxiety Stories", icon: "🧘" },
  { value: "depression", label: "Depression Support", icon: "🌈" },
  { value: "gratitude", label: "Gratitude Journal", icon: "🙏" },
  { value: "support", label: "Peer Support", icon: "🤝" },
];

export default function Community() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [topics, setTopics] = useState<CommunityTopic[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Create topic form
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("general");
  const [newContent, setNewContent] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load topics with profile data
      const { data: topicsData, error: topicsError } = await supabase
        .from("community_topics")
        .select("*, profile:users_profile(*)")
        .order("created_at", { ascending: false })
        .limit(50);

      if (topicsError) throw topicsError;

      // Load active challenges
      const { data: challengesData, error: challengesError } = await supabase
        .from("challenges")
        .select("*")
        .eq("is_active", true)
        .order("end_date", { ascending: true });

      if (challengesError) throw challengesError;

      setTopics(topicsData || []);
      setChallenges(challengesData || []);
    } catch (error) {
      console.error("Error loading community data:", error);
      toast({
        title: "Error loading community",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createTopic = async () => {
    if (!newTitle.trim() || !newContent.trim()) {
      toast({
        title: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("community_topics")
        .insert({
          user_id: user.id,
          category: newCategory,
          title: newTitle,
          content: newContent,
        });

      if (error) throw error;

      toast({
        title: "Topic created",
        description: "Your post has been shared with the community",
      });

      setIsCreateOpen(false);
      setNewTitle("");
      setNewContent("");
      setNewCategory("general");
      loadData();
    } catch (error) {
      console.error("Error creating topic:", error);
      toast({
        title: "Error creating topic",
        variant: "destructive",
      });
    }
  };

  const joinChallenge = async (challengeId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("user_challenges")
        .insert({
          user_id: user.id,
          challenge_id: challengeId,
        });

      if (error) {
        if (error.code === "23505") {
          toast({
            title: "Already joined",
            description: "You're already participating in this challenge",
          });
        } else {
          throw error;
        }
        return;
      }

      toast({
        title: "Challenge joined!",
        description: "Good luck! Track your progress in the Stats page",
      });

      loadData();
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast({
        title: "Error joining challenge",
        variant: "destructive",
      });
    }
  };

  const filteredTopics = topics.filter(
    (topic) =>
      topic.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      topic.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryInfo = (category: string) => {
    return CATEGORIES.find((c) => c.value === category) || CATEGORIES[0];
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
      <AppBar title="Community" showBack={false} />

      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <CardTitle>Peace Community</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Connect with others on their mental health journey. Share experiences, get support, 
                  and join challenges together.
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="discussions" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="discussions">Discussions</TabsTrigger>
            <TabsTrigger value="challenges">Challenges</TabsTrigger>
          </TabsList>

          <TabsContent value="discussions" className="space-y-4 mt-6">
            {/* Search and Create */}
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Discussion</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={newCategory} onValueChange={setNewCategory}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>
                              {cat.icon} {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Title</Label>
                      <Input
                        placeholder="What's on your mind?"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Content</Label>
                      <Textarea
                        placeholder="Share your thoughts..."
                        value={newContent}
                        onChange={(e) => setNewContent(e.target.value)}
                        rows={6}
                      />
                    </div>

                    <Button onClick={createTopic} className="w-full">
                      Post Discussion
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {/* Category Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              <Badge
                variant={searchQuery === "" ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSearchQuery("")}
              >
                All
              </Badge>
              {CATEGORIES.map((cat) => (
                <Badge
                  key={cat.value}
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(cat.value)}
                >
                  {cat.icon} {cat.label}
                </Badge>
              ))}
            </div>

            {/* Topics List */}
            <div className="space-y-3">
              {filteredTopics.length === 0 ? (
                <Card>
                  <CardContent className="pt-12 pb-12 text-center">
                    <p className="text-muted-foreground">
                      No discussions found. Be the first to start a conversation!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filteredTopics.map((topic) => {
                  const categoryInfo = getCategoryInfo(topic.category);
                  return (
                    <Card
                      key={topic.id}
                      className="hover:shadow-lg transition-all duration-200 cursor-pointer"
                      onClick={() => navigate(`/community/${topic.id}`)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">
                                {categoryInfo.icon} {categoryInfo.label}
                              </Badge>
                              {topic.is_pinned && (
                                <Badge>Pinned</Badge>
                              )}
                            </div>
                            <h3 className="font-semibold text-lg">{topic.title}</h3>
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {topic.content}
                            </p>
                          </div>
                          <MessageSquare className="w-5 h-5 text-primary flex-shrink-0" />
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            by {topic.profile?.display_name || "Anonymous"}
                          </span>
                          <span>{format(new Date(topic.created_at), "MMM d, yyyy")}</span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="challenges" className="space-y-4 mt-6">
            {challenges.length === 0 ? (
              <Card>
                <CardContent className="pt-12 pb-12 text-center">
                  <p className="text-muted-foreground">
                    No active challenges at the moment. Check back soon!
                  </p>
                </CardContent>
              </Card>
            ) : (
              challenges.map((challenge) => (
                <Card
                  key={challenge.id}
                  className="hover:shadow-lg transition-all duration-200"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="flex items-center gap-2">
                          {challenge.title}
                          <Badge>{challenge.type}</Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-2">
                          {challenge.description}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm space-y-1">
                        <p className="text-muted-foreground">
                          Goal: {challenge.goal_value} {challenge.goal_unit}
                        </p>
                        <p className="text-muted-foreground">
                          Ends: {format(new Date(challenge.end_date), "MMM d, yyyy")}
                        </p>
                      </div>
                      <Button
                        onClick={() => joinChallenge(challenge.id)}
                      >
                        Join Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNav />
    </div>
  );
}
