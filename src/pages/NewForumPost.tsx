import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Hash, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ForumCategory } from "@/types/db";
import { BottomNav } from "@/components/BottomNav";

export default function NewForumPost() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data } = await supabase
        .from('forum_categories')
        .select('*')
        .order('sort_order');
      
      if (data) {
        setCategories(data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !selectedCategory) return;

    try {
      setSubmitting(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/auth/login');
        return;
      }

      const { error } = await supabase
        .from('forum_posts')
        .insert({
          user_id: user.id,
          category_id: selectedCategory,
          title: title.trim(),
          content: content.trim(),
          tags: tags
        });

      if (error) throw error;

      navigate('/community');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const selectedCategoryData = categories.find(cat => cat.id === selectedCategory);

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="bg-card border-b border-border px-6 py-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/community')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">New Post</h1>
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim() || !content.trim() || !selectedCategory || submitting}
          >
            {submitting ? 'Posting...' : 'Post'}
          </Button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Category Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Choose a Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Label htmlFor="category">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedCategoryData && (
                <p className="text-sm text-muted-foreground">
                  {selectedCategoryData.description}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Post Content */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Post Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="What's on your mind?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={200}
              />
              <p className="text-xs text-muted-foreground">
                {title.length}/200 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Share your thoughts, experiences, or ask for advice..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (optional)</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add a tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button type="button" onClick={handleAddTag} disabled={!newTag.trim()}>
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      {tag}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 hover:bg-transparent"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Guidelines */}
        <Card className="bg-muted">
          <CardHeader>
            <CardTitle className="text-lg">Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Be respectful and supportive of others</li>
              <li>• Share your experiences to help others</li>
              <li>• Keep discussions focused on mental health and wellness</li>
              <li>• Avoid sharing personal medical advice</li>
              <li>• Report any inappropriate content</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <BottomNav />
    </div>
  );
}