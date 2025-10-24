import { useState } from "react";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MessageCircle, Users, TrendingUp, Search, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Community() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const forums = [
    { 
      id: "1", 
      name: "General Discussion", 
      description: "Share your thoughts, experiences, and connect with others",
      icon: "💬",
      posts: 234,
      members: 1542
    },
    { 
      id: "2", 
      name: "Anxiety Support", 
      description: "Support and strategies for managing anxiety",
      icon: "🌊",
      posts: 187,
      members: 892
    },
    { 
      id: "3", 
      name: "Depression Support", 
      description: "A safe space to share and find support",
      icon: "🌱",
      posts: 156,
      members: 743
    },
    { 
      id: "4", 
      name: "Self-Care Tips", 
      description: "Share and discover self-care practices",
      icon: "✨",
      posts: 312,
      members: 1823
    },
    { 
      id: "5", 
      name: "Success Stories", 
      description: "Celebrate wins and inspire others",
      icon: "🎉",
      posts: 98,
      members: 1234
    },
    { 
      id: "6", 
      name: "Resources & Tools", 
      description: "Share helpful resources and tools",
      icon: "📚",
      posts: 145,
      members: 967
    },
  ];

  const supportGroups = [
    {
      id: "1",
      name: "Morning Mindfulness",
      description: "Start your day with intention",
      members: 23,
      category: "Mindfulness",
      isPrivate: false
    },
    {
      id: "2",
      name: "Young Adults Support",
      description: "Support group for ages 18-30",
      members: 45,
      category: "Age-based",
      isPrivate: false
    },
    {
      id: "3",
      name: "Working Professionals",
      description: "Balance work and mental health",
      members: 67,
      category: "Career",
      isPrivate: false
    },
    {
      id: "4",
      name: "Parents & Caregivers",
      description: "Support for those caring for others",
      members: 34,
      category: "Family",
      isPrivate: false
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="Community" />

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Community</h1>
              <p className="text-muted-foreground">Connect, share, and grow together</p>
            </div>
            <Button onClick={() => navigate("/community/new-post")}>
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forums and groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="forums" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="forums">Forums</TabsTrigger>
            <TabsTrigger value="groups">Support Groups</TabsTrigger>
          </TabsList>

          {/* Forums Tab */}
          <TabsContent value="forums" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {forums.map((forum) => (
                <Card 
                  key={forum.id} 
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/community/forum/${forum.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="text-4xl">{forum.icon}</div>
                        <div>
                          <CardTitle className="text-xl">{forum.name}</CardTitle>
                          <CardDescription>{forum.description}</CardDescription>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>{forum.posts} posts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{forum.members} members</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Support Groups Tab */}
          <TabsContent value="groups" className="space-y-4 mt-6">
            <div className="mb-4">
              <Button onClick={() => navigate("/community/create-group")} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Create Support Group
              </Button>
            </div>

            <div className="grid gap-4">
              {supportGroups.map((group) => (
                <Card 
                  key={group.id}
                  className="cursor-pointer hover:bg-accent/50 transition-colors"
                  onClick={() => navigate(`/community/group/${group.id}`)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-xl">{group.name}</CardTitle>
                          {group.isPrivate && (
                            <span className="text-xs bg-secondary px-2 py-1 rounded-full">Private</span>
                          )}
                        </div>
                        <CardDescription>{group.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{group.members} members</span>
                      </div>
                      <div className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {group.category}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Community Guidelines */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>• Be respectful and supportive of others</p>
            <p>• Keep personal information private</p>
            <p>• No medical advice - share experiences only</p>
            <p>• Report concerning content to moderators</p>
            <p>• For crisis support, contact emergency services</p>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}
