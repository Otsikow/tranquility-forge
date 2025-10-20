/**
 * IndexedDB wrapper for offline-first journal entries
 * Caches last 50 entries per user for offline access
 */

import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { JournalEntry } from '@/types/db';

interface PeaceDB extends DBSchema {
  journal_entries: {
    key: string;
    value: JournalEntry & { synced: boolean; deleted?: boolean };
    indexes: { 'by-date': string; 'by-user': string };
  };
  sync_queue: {
    key: string;
    value: {
      id: string;
      action: 'create' | 'update' | 'delete';
      data: Partial<JournalEntry>;
      timestamp: number;
    };
  };
}

let dbInstance: IDBPDatabase<PeaceDB> | null = null;

export async function getDB(): Promise<IDBPDatabase<PeaceDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<PeaceDB>('peace-app', 1, {
    upgrade(db) {
      // Journal entries store
      if (!db.objectStoreNames.contains('journal_entries')) {
        const journalStore = db.createObjectStore('journal_entries', {
          keyPath: 'id',
        });
        journalStore.createIndex('by-date', 'created_at');
        journalStore.createIndex('by-user', 'user_id');
      }

      // Sync queue store
      if (!db.objectStoreNames.contains('sync_queue')) {
        db.createObjectStore('sync_queue', {
          keyPath: 'id',
        });
      }
    },
  });

  return dbInstance;
}

// Cache journal entries (keep last 50 per user)
export async function cacheJournalEntries(
  entries: JournalEntry[],
  userId: string
): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('journal_entries', 'readwrite');

  // Get existing entries for this user
  const existingEntries = await tx.store.index('by-user').getAllKeys(userId);

  // Add new entries
  for (const entry of entries) {
    await tx.store.put({ ...entry, synced: true });
  }

  // Keep only last 50 entries per user
  const allUserEntries = await tx.store.index('by-user').getAll(userId);
  const sortedEntries = allUserEntries.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // Delete old entries beyond 50
  if (sortedEntries.length > 50) {
    const entriesToDelete = sortedEntries.slice(50);
    for (const entry of entriesToDelete) {
      await tx.store.delete(entry.id);
    }
  }

  await tx.done;
}

// Get cached entries for a user
export async function getCachedJournalEntries(
  userId: string
): Promise<JournalEntry[]> {
  const db = await getDB();
  const entries = await db.getAllFromIndex('journal_entries', 'by-user', userId);
  
  // Filter out deleted entries and sort by date
  return entries
    .filter(entry => !entry.deleted)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(({ synced, deleted, ...entry }) => entry);
}

// Add entry to cache (optimistic)
export async function addCachedEntry(
  entry: JournalEntry,
  synced: boolean = false
): Promise<void> {
  const db = await getDB();
  await db.put('journal_entries', { ...entry, synced });
}

// Update cached entry
export async function updateCachedEntry(
  id: string,
  updates: Partial<JournalEntry>
): Promise<void> {
  const db = await getDB();
  const existing = await db.get('journal_entries', id);
  if (existing) {
    await db.put('journal_entries', { ...existing, ...updates, synced: false });
  }
}

// Mark entry as deleted (soft delete for sync)
export async function deleteCachedEntry(id: string): Promise<void> {
  const db = await getDB();
  const existing = await db.get('journal_entries', id);
  if (existing) {
    await db.put('journal_entries', { ...existing, deleted: true, synced: false });
  }
}

// Add to sync queue
export async function addToSyncQueue(
  id: string,
  action: 'create' | 'update' | 'delete',
  data: Partial<JournalEntry>
): Promise<void> {
  const db = await getDB();
  await db.put('sync_queue', {
    id: `${action}-${id}-${Date.now()}`,
    action,
    data,
    timestamp: Date.now(),
  });
}

// Get sync queue
export async function getSyncQueue() {
  const db = await getDB();
  return await db.getAll('sync_queue');
}

// Clear sync queue item
export async function clearSyncQueueItem(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('sync_queue', id);
}

// Clear all cached data (logout)
export async function clearCache(): Promise<void> {
  const db = await getDB();
  await db.clear('journal_entries');
  await db.clear('sync_queue');
}
