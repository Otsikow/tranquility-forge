import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { AppBar } from "@/components/AppBar";
import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Loader2 } from "lucide-react";
import { SyncIndicator } from "@/components/SyncIndicator";
import { useJournalEntries } from "@/hooks/useJournalEntries";
import { format } from "date-fns";
import cappadociaImage from "@/assets/cappadocia.jpg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const moodColors = [
  "bg-red-500",
  "bg-red-400",
  "bg-orange-500",
  "bg-orange-400",
  "bg-yellow-500",
  "bg-yellow-400",
  "bg-green-400",
  "bg-green-500",
  "bg-emerald-500",
  "bg-emerald-600",
];

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

export default function Journal() {
  const navigate = useNavigate();
  const { entries, loading, syncState } = useJournalEntries();
  const [searchQuery, setSearchQuery] = useState("");
  const [moodFilter, setMoodFilter] = useState<string>("all");

  // Filter and search entries
  const filteredEntries = useMemo(() => {
    let filtered = entries;

    // Filter by mood
    if (moodFilter !== "all") {
      const moodValue = parseInt(moodFilter);
      filtered = filtered.filter(entry => entry.mood === moodValue);
    }

    // Search by text and tags
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(entry => {
        const titleMatch = entry.title?.toLowerCase().includes(query);
        const contentMatch = entry.content?.toLowerCase().includes(query);
        const tagMatch = entry.tags?.some(tag => tag.toLowerCase().includes(query));
        return titleMatch || contentMatch || tagMatch;
      });
    }

    return filtered;
  }, [entries, searchQuery, moodFilter]);

  return (
    <div className="min-h-screen bg-background pb-20">
      <AppBar title="My Journal" showBack={false} />

      {/* Hero Section */}
      <div className="relative h-44 md:h-56 overflow-hidden">
        <img
          src={cappadociaImage}
          alt="Peaceful Cappadocia landscape with hot air balloons at sunrise"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/30 to-background" />
        <div className="absolute bottom-6 left-6 right-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground drop-shadow-lg mb-1">
            Your Reflection Space
          </h2>
          <p className="text-foreground/90 drop-shadow-md">
            Document your journey, one thought at a time
          </p>
        </div>
      </div>
      
      <div className="px-6 py-6 space-y-6 max-w-4xl mx-auto">
        {/* Sync Indicator & New Entry Button */}
        <div className="flex items-center justify-between">
          <SyncIndicator state={syncState} />
          <Button size="lg" onClick={() => navigate("/journal/new")} className="gap-2">
            <Plus className="h-5 w-5" />
            New Entry
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search entries, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={moodFilter} onValueChange={setMoodFilter}>
            <SelectTrigger className="sm:w-[180px]">
              <SelectValue placeholder="Filter by mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Moods</SelectItem>
              {moodLabels.map((label, index) => (
                <SelectItem key={index + 1} value={String(index + 1)}>
                  {label} ({index + 1})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Entries List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : filteredEntries.length === 0 ? (
          <Card>
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4">
                {searchQuery || moodFilter !== "all"
                  ? "No entries found matching your filters"
                  : "No journal entries yet"}
              </p>
              {!searchQuery && moodFilter === "all" && (
                <Button onClick={() => navigate("/journal/new")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Entry
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredEntries.map((entry, index) => (
              <Card 
                key={entry.id} 
                className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-0.5 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
                onClick={() => navigate(`/journal/${entry.id}`)}
              >
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-start gap-4">
                    {/* Mood Indicator */}
                    {entry.mood && (
                      <div className="flex flex-col items-center gap-1 min-w-[60px]">
                        <div 
                          className={`w-12 h-12 rounded-full ${moodColors[entry.mood - 1]} flex items-center justify-center text-white font-semibold shadow-md`}
                        >
                          {entry.mood}
                        </div>
                        <span className="text-xs text-muted-foreground text-center">
                          {moodLabels[entry.mood - 1]}
                        </span>
                      </div>
                    )}

                    {/* Entry Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-foreground truncate">
                          {entry.title || "Untitled Entry"}
                        </h3>
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {format(new Date(entry.created_at), "MMM d, yyyy")}
                        </span>
                      </div>
                      
                      {entry.content && (
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {entry.content}
                        </p>
                      )}

                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {entry.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                          {entry.tags.length > 3 && (
                            <Badge variant="secondary" className="text-xs">
                              +{entry.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
