import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { X, Trash2, Loader2 } from "lucide-react";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { useToast } from "@/hooks/use-toast";
import type { UpdateJournalEntry } from "@/types/db";

export default function JournalEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { entries, updateEntry, deleteEntry } = useJournalEntries();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<number>(5);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");

  const moodLabels = [
    "Very Low",
    "Low",
    "Somewhat Low",
    "Below Average",
    "Neutral",
    "Above Average",
    "Good",
    "Very Good",
    "Great",
    "Excellent",
  ];

  // Load entry data
  useEffect(() => {
    const entry = entries.find(e => e.id === id);
    if (entry) {
      setTitle(entry.title || "");
      setContent(entry.content || "");
      setMood(entry.mood || 5);
      setTags(entry.tags || []);
      setLoading(false);
    } else if (!loading) {
      toast({
        title: "Entry not found",
        variant: "destructive",
      });
      navigate("/journal");
    }
  }, [id, entries, navigate, toast, loading]);

  const handleAddTag = (e: FormEvent) => {
    e.preventDefault();
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag) && tags.length < 5) {
      setTags([...tags, tag]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!id) return;

    // Validation
    if (mood && !content.trim()) {
      toast({
        title: "Validation Error",
        description: "Content is required when mood is selected",
        variant: "destructive",
      });
      return;
    }

    if (!content.trim() && !mood) {
      toast({
        title: "Validation Error",
        description: "Please add content or select a mood",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);

    try {
      const updates: UpdateJournalEntry = {
        mood: mood || null,
        title: title.trim() || null,
        content: content.trim() || null,
        tags,
      };

      await updateEntry(id, updates);
      navigate("/journal");
    } catch (error) {
      console.error("Error updating entry:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;

    setDeleting(true);
    try {
      await deleteEntry(id);
      navigate("/journal");
    } catch (error) {
      console.error("Error deleting entry:", error);
      setDeleting(false);
    }
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
      <AppBar title="Edit Entry" showBack />

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Mood Slider */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="mood">How are you feeling? (1-10)</Label>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-8">{mood}</span>
                <Slider
                  id="mood"
                  value={[mood]}
                  onValueChange={(value) => setMood(value[0])}
                  min={1}
                  max={10}
                  step={1}
                  className="flex-1"
                />
              </div>
              <p className="text-sm text-muted-foreground text-center">
                {moodLabels[mood - 1]}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Title (Optional)</Label>
          <Input
            id="title"
            placeholder="Give your entry a title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content">
            What's on your mind? {mood && <span className="text-destructive">*</span>}
          </Label>
          <Textarea
            id="content"
            placeholder="Write your thoughts here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={10}
            className="resize-none"
          />
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label htmlFor="tags">Tags (Optional, max 5)</Label>
          <div className="flex gap-2">
            <Input
              id="tags"
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag(e);
                }
              }}
              disabled={tags.length >= 5}
              maxLength={20}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              disabled={!tagInput.trim() || tags.length >= 5}
              variant="outline"
            >
              Add
            </Button>
          </div>
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/journal")}
              className="flex-1"
              disabled={submitting || deleting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={submitting || deleting}
            >
              {submitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>

          {/* Delete Button */}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                disabled={submitting || deleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                {deleting ? 'Deleting...' : 'Delete Entry'}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Journal Entry?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your
                  journal entry and all associated data.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </form>

      <BottomNav />
    </div>
  );
}
