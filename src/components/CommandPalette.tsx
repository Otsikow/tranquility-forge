import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useCommandPalette } from "@/hooks/useCommandPalette";
import { supabase } from "@/integrations/supabase/client";
import { getCachedJournalEntries } from "@/lib/db";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { Book, Music, FileText, Calendar, Users, Brain, Moon, Crown } from "lucide-react";
import { format } from "date-fns";

interface SearchResult {
  id: string;
  type: "journal" | "meditation";
  title: string;
  description?: string;
  date?: string;
  mood?: number;
}

export function CommandPalette() {
  const { isOpen, close } = useCommandPalette();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Keyboard shortcut handler
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        useCommandPalette.getState().toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const searchContent = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    const allResults: SearchResult[] = [];

    try {
      // Search online journals (Supabase)
      const { data: onlineJournals, error: journalError } = await supabase
        .from("journal_entries")
        .select("id, title, content, created_at, mood, tags")
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,tags.cs.{${query}}`)
        .order("created_at", { ascending: false })
        .limit(5);

      if (!journalError && onlineJournals) {
        allResults.push(
          ...onlineJournals.map((entry) => ({
            id: entry.id,
            type: "journal" as const,
            title: entry.title || "Untitled",
            description: entry.content?.substring(0, 100),
            date: entry.created_at,
            mood: entry.mood,
          }))
        );
      }

      // Search offline journals (IndexedDB) - requires user ID
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const offlineJournals = await getCachedJournalEntries(user.id);
        const matchingOffline = offlineJournals.filter(
          (entry) =>
            entry.title?.toLowerCase().includes(query.toLowerCase()) ||
            entry.content?.toLowerCase().includes(query.toLowerCase()) ||
            entry.tags?.some((tag) => tag.toLowerCase().includes(query.toLowerCase()))
        );

        // Merge offline results, avoiding duplicates
        matchingOffline.forEach((entry) => {
          if (!allResults.some((r) => r.id === entry.id)) {
            allResults.push({
              id: entry.id,
              type: "journal",
              title: entry.title || "Untitled",
              description: entry.content?.substring(0, 100),
              date: entry.created_at,
              mood: entry.mood,
            });
          }
        });
      }

      // Search meditations
      const { data: meditations, error: meditationError } = await supabase
        .from("meditations")
        .select("id, title, description")
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(5);

      if (!meditationError && meditations) {
        allResults.push(
          ...meditations.map((meditation) => ({
            id: meditation.id,
            type: "meditation" as const,
            title: meditation.title,
            description: meditation.description,
          }))
        );
      }

      setResults(allResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      searchContent(search);
    }, 300);

    return () => clearTimeout(debounce);
  }, [search, searchContent]);

  const handleSelect = (result: SearchResult) => {
    close();
    setSearch("");
    
    if (result.type === "journal") {
      navigate(`/journal/${result.id}`);
    } else if (result.type === "meditation") {
      navigate(`/meditations/${result.id}`);
    }
  };

  const journalResults = results.filter((r) => r.type === "journal");
  const meditationResults = results.filter((r) => r.type === "meditation");

  return (
    <CommandDialog open={isOpen} onOpenChange={(open) => !open && close()}>
      <CommandInput
        placeholder="Search journals, meditations..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          {isLoading ? "Searching..." : "No results found."}
        </CommandEmpty>

        {journalResults.length > 0 && (
          <>
            <CommandGroup heading="Journal Entries">
              {journalResults.map((result) => (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="flex items-start gap-3 py-3"
                >
                  <Book className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{result.title}</p>
                      {result.mood && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10">
                          Mood: {result.mood}/10
                        </span>
                      )}
                    </div>
                    {result.description && (
                      <p className="text-sm text-muted-foreground truncate">
                        {result.description}
                      </p>
                    )}
                    {result.date && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(new Date(result.date), "PPP")}
                      </p>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
            {meditationResults.length > 0 && <CommandSeparator />}
          </>
        )}

        {meditationResults.length > 0 && (
          <CommandGroup heading="Meditations">
            {meditationResults.map((result) => (
              <CommandItem
                key={result.id}
                onSelect={() => handleSelect(result)}
                className="flex items-start gap-3 py-3"
              >
                <Music className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{result.title}</p>
                  {result.description && (
                    <p className="text-sm text-muted-foreground truncate">
                      {result.description}
                    </p>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Quick navigation */}
        <CommandGroup heading="Navigate">
          <CommandItem onSelect={() => { close(); navigate('/community'); }} className="flex items-center gap-3 py-3">
            <Users className="h-4 w-4 text-primary" />
            <span>Community</span>
          </CommandItem>
          <CommandItem onSelect={() => { close(); navigate('/cbt'); }} className="flex items-center gap-3 py-3">
            <Brain className="h-4 w-4 text-primary" />
            <span>CBT Tools</span>
          </CommandItem>
          <CommandItem onSelect={() => { close(); navigate('/sleep'); }} className="flex items-center gap-3 py-3">
            <Moon className="h-4 w-4 text-primary" />
            <span>Sleep</span>
          </CommandItem>
          <CommandItem onSelect={() => { close(); navigate('/premium'); }} className="flex items-center gap-3 py-3">
            <Crown className="h-4 w-4 text-primary" />
            <span>Premium</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
