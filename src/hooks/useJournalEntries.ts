/**
 * Hook for managing journal entries with offline-first support
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { JournalEntry, InsertJournalEntry, UpdateJournalEntry } from '@/types/db';
import {
  cacheJournalEntries,
  getCachedJournalEntries,
  addCachedEntry,
  updateCachedEntry,
  deleteCachedEntry,
  addToSyncQueue,
  getSyncQueue,
  clearSyncQueueItem,
} from '@/lib/db';

export type SyncState = 'synced' | 'syncing' | 'offline' | 'error';

export function useJournalEntries() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncState, setSyncState] = useState<SyncState>('synced');
  const { toast } = useToast();

  // Fetch entries from Supabase
  const fetchEntries = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      if (data) {
        setEntries(data);
        await cacheJournalEntries(data, user.id);
        setSyncState('synced');
      }
    } catch (error) {
      console.error('Error fetching entries:', error);
      // Load from cache on error
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const cached = await getCachedJournalEntries(user.id);
        setEntries(cached);
        setSyncState('offline');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Sync pending changes
  const syncPendingChanges = useCallback(async () => {
    try {
      setSyncState('syncing');
      const queue = await getSyncQueue();

      for (const item of queue) {
        try {
          if (item.action === 'create') {
            const { error } = await supabase
              .from('journal_entries')
              .insert(item.data as InsertJournalEntry);
            if (error) throw error;
          } else if (item.action === 'update') {
            const { id, ...updates } = item.data;
            const { error } = await supabase
              .from('journal_entries')
              .update(updates)
              .eq('id', id!);
            if (error) throw error;
          } else if (item.action === 'delete') {
            const { error } = await supabase
              .from('journal_entries')
              .delete()
              .eq('id', item.data.id!);
            if (error) throw error;
          }

          await clearSyncQueueItem(item.id);
        } catch (error) {
          console.error('Error syncing item:', error);
        }
      }

      await fetchEntries();
      setSyncState('synced');
    } catch (error) {
      console.error('Error syncing:', error);
      setSyncState('error');
    }
  }, [fetchEntries]);

  // Create entry
  const createEntry = useCallback(async (entry: InsertJournalEntry) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const tempId = crypto.randomUUID();
      const newEntry: JournalEntry = {
        id: tempId,
        user_id: user.id,
        mood: entry.mood || null,
        title: entry.title || null,
        content: entry.content || null,
        tags: entry.tags || [],
        created_at: new Date().toISOString(),
      };

      // Optimistic update
      setEntries(prev => [newEntry, ...prev]);
      await addCachedEntry(newEntry, false);

      // Try to sync
      const { data, error } = await supabase
        .from('journal_entries')
        .insert(entry)
        .select()
        .single();

      if (error) {
        // Add to sync queue
        await addToSyncQueue(tempId, 'create', entry);
        setSyncState('offline');
        toast({
          title: 'Saved offline',
          description: 'Entry will sync when connection is restored',
        });
      } else if (data) {
        // Replace temp entry with real one
        setEntries(prev => prev.map(e => e.id === tempId ? data : e));
        await addCachedEntry(data, true);
        toast({ title: 'Entry saved successfully' });
      }

      return data || newEntry;
    } catch (error) {
      console.error('Error creating entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to create entry',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Update entry
  const updateEntry = useCallback(async (id: string, updates: UpdateJournalEntry) => {
    try {
      // Optimistic update
      setEntries(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
      await updateCachedEntry(id, updates);

      // Try to sync
      const { data, error } = await supabase
        .from('journal_entries')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        await addToSyncQueue(id, 'update', { id, ...updates });
        setSyncState('offline');
        toast({
          title: 'Saved offline',
          description: 'Changes will sync when connection is restored',
        });
      } else if (data) {
        setEntries(prev => prev.map(e => e.id === id ? data : e));
        toast({ title: 'Entry updated successfully' });
      }

      return data;
    } catch (error) {
      console.error('Error updating entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to update entry',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast]);

  // Delete entry
  const deleteEntry = useCallback(async (id: string) => {
    try {
      // Optimistic update
      setEntries(prev => prev.filter(e => e.id !== id));
      await deleteCachedEntry(id);

      // Try to sync
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id);

      if (error) {
        await addToSyncQueue(id, 'delete', { id });
        setSyncState('offline');
        toast({
          title: 'Deleted offline',
          description: 'Deletion will sync when connection is restored',
        });
      } else {
        toast({ title: 'Entry deleted successfully' });
      }
    } catch (error) {
      console.error('Error deleting entry:', error);
      // Rollback on error
      await fetchEntries();
      toast({
        title: 'Error',
        description: 'Failed to delete entry',
        variant: 'destructive',
      });
      throw error;
    }
  }, [toast, fetchEntries]);

  // Initial load
  useEffect(() => {
    fetchEntries();

    // Set up realtime subscription
    const channel = supabase
      .channel('journal-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'journal_entries',
        },
        () => {
          fetchEntries();
        }
      )
      .subscribe();

    // Sync on reconnect
    const handleOnline = () => {
      syncPendingChanges();
    };
    window.addEventListener('online', handleOnline);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('online', handleOnline);
    };
  }, [fetchEntries, syncPendingChanges]);

  return {
    entries,
    loading,
    syncState,
    createEntry,
    updateEntry,
    deleteEntry,
    refetch: fetchEntries,
    syncPendingChanges,
  };
}
