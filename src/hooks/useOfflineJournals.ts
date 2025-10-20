import { useState, useEffect } from 'react';
import {
  saveJournalOffline,
  getOfflineJournals,
  markJournalSynced,
} from '@/lib/offlineStorage';
import { supabase } from '@/integrations/supabase/client';

export const useOfflineJournals = () => {
  const [journals, setJournals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    loadJournals();

    const handleOnline = () => {
      setIsOnline(true);
      syncJournals();
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadJournals = async () => {
    setIsLoading(true);
    try {
      if (isOnline) {
        // Load from server
        const { data, error } = await supabase
          .from('journal_entries')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(200);

        if (error) throw error;

        // Cache in IndexedDB
        if (data) {
          for (const journal of data) {
            await saveJournalOffline(journal);
            await markJournalSynced(journal.id);
          }
        }

        setJournals(data || []);
      } else {
        // Load from IndexedDB when offline
        const offlineJournals = await getOfflineJournals();
        setJournals(offlineJournals);
      }
    } catch (error) {
      console.error('Failed to load journals:', error);
      // Fallback to offline data
      const offlineJournals = await getOfflineJournals();
      setJournals(offlineJournals);
    } finally {
      setIsLoading(false);
    }
  };

  const syncJournals = async () => {
    try {
      const offlineJournals = await getOfflineJournals();
      const unsyncedJournals = offlineJournals.filter(j => !j.synced);

      for (const journal of unsyncedJournals) {
        try {
          const { error } = await supabase
            .from('journal_entries')
            .upsert({
              id: journal.id,
              user_id: journal.user_id,
              title: journal.title,
              content: journal.content,
              mood: journal.mood,
              tags: journal.tags,
              created_at: journal.created_at,
            });

          if (!error) {
            await markJournalSynced(journal.id);
          }
        } catch (error) {
          console.error('Failed to sync journal:', journal.id, error);
        }
      }

      // Reload from server
      await loadJournals();
    } catch (error) {
      console.error('Journal sync failed:', error);
    }
  };

  const createJournal = async (journal: any) => {
    // Save locally first
    await saveJournalOffline(journal);
    setJournals(prev => [journal, ...prev]);

    // Try to sync if online
    if (isOnline) {
      try {
        const { error } = await supabase
          .from('journal_entries')
          .insert(journal);

        if (!error) {
          await markJournalSynced(journal.id);
        }
      } catch (error) {
        console.error('Failed to sync new journal:', error);
        // Will be synced later
      }
    }
  };

  return {
    journals,
    isLoading,
    isOnline,
    createJournal,
    refreshJournals: loadJournals,
  };
};
