import { openDB, DBSchema, IDBPDatabase } from 'idb';

const DB_NAME = 'PeaceOfflineDB';
const DB_VERSION = 1;

// Storage quotas (in bytes)
export const STORAGE_QUOTAS = {
  JOURNALS: 10 * 1024 * 1024, // 10MB
  MOODS: 1 * 1024 * 1024,     // 1MB
  MEDITATIONS: 100 * 1024 * 1024, // 100MB per meditation
  MAX_TOTAL: 200 * 1024 * 1024,   // 200MB total
};

export const LIMITS = {
  MAX_JOURNALS: 200,
  MOOD_DAYS: 60,
};

// Database schema
interface PeaceDB extends DBSchema {
  journals: {
    key: string;
    value: {
      id: string;
      user_id: string;
      title: string | null;
      content: string | null;
      mood: number | null;
      tags: string[];
      created_at: string;
      synced: boolean;
      size: number;
    };
    indexes: {
      'by-date': string;
      'by-synced': number;
    };
  };
  moods: {
    key: string;
    value: {
      id: string;
      user_id: string;
      mood: number;
      note: string | null;
      created_at: string;
      synced: boolean;
    };
    indexes: {
      'by-date': string;
    };
  };
  meditations: {
    key: string;
    value: {
      id: string;
      title: string;
      audio_blob: Blob;
      size: number;
      downloaded_at: string;
      last_accessed_at: string;
    };
    indexes: {
      'by-accessed': string;
      'by-size': number;
    };
  };
  metadata: {
    key: string;
    value: {
      total_size: number;
      last_cleanup: string;
    };
  };
}

let dbInstance: IDBPDatabase<PeaceDB> | null = null;

// Open database
export const openOfflineDB = async (): Promise<IDBPDatabase<PeaceDB>> => {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<PeaceDB>(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Journals store
      if (!db.objectStoreNames.contains('journals')) {
        const journalStore = db.createObjectStore('journals', { keyPath: 'id' });
        journalStore.createIndex('by-date', 'created_at');
        journalStore.createIndex('by-synced', 'synced');
      }

      // Moods store
      if (!db.objectStoreNames.contains('moods')) {
        const moodStore = db.createObjectStore('moods', { keyPath: 'id' });
        moodStore.createIndex('by-date', 'created_at');
      }

      // Meditations store
      if (!db.objectStoreNames.contains('meditations')) {
        const meditationStore = db.createObjectStore('meditations', { keyPath: 'id' });
        meditationStore.createIndex('by-accessed', 'last_accessed_at');
        meditationStore.createIndex('by-size', 'size');
      }

      // Metadata store
      if (!db.objectStoreNames.contains('metadata')) {
        db.createObjectStore('metadata', { keyPath: 'key' });
      }
    },
  });

  return dbInstance;
};

// === JOURNALS ===

export const saveJournalOffline = async (journal: any): Promise<void> => {
  const db = await openOfflineDB();
  const size = new Blob([JSON.stringify(journal)]).size;

  await db.put('journals', {
    ...journal,
    synced: false,
    size,
  });

  await enforceJournalLimit();
};

export const getOfflineJournals = async (limit = LIMITS.MAX_JOURNALS): Promise<any[]> => {
  const db = await openOfflineDB();
  const journals = await db.getAllFromIndex('journals', 'by-date');
  return journals.slice(-limit).reverse();
};

export const markJournalSynced = async (id: string): Promise<void> => {
  const db = await openOfflineDB();
  const journal = await db.get('journals', id);
  if (journal) {
    journal.synced = true;
    await db.put('journals', journal);
  }
};

const enforceJournalLimit = async (): Promise<void> => {
  const db = await openOfflineDB();
  const journals = await db.getAllFromIndex('journals', 'by-date');

  if (journals.length > LIMITS.MAX_JOURNALS) {
    const toDelete = journals.slice(0, journals.length - LIMITS.MAX_JOURNALS);
    for (const journal of toDelete) {
      await db.delete('journals', journal.id);
    }
    console.log(`[Offline] Evicted ${toDelete.length} old journals`);
  }
};

// === MOODS ===

export const saveMoodOffline = async (mood: any): Promise<void> => {
  const db = await openOfflineDB();

  await db.put('moods', {
    ...mood,
    synced: false,
  });

  await enforceMoodLimit();
};

export const getOfflineMoods = async (days = LIMITS.MOOD_DAYS): Promise<any[]> => {
  const db = await openOfflineDB();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  const allMoods = await db.getAllFromIndex('moods', 'by-date');
  return allMoods.filter(m => new Date(m.created_at) >= cutoffDate);
};

export const markMoodSynced = async (id: string): Promise<void> => {
  const db = await openOfflineDB();
  const mood = await db.get('moods', id);
  if (mood) {
    mood.synced = true;
    await db.put('moods', mood);
  }
};

const enforceMoodLimit = async (): Promise<void> => {
  const db = await openOfflineDB();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - LIMITS.MOOD_DAYS);

  const allMoods = await db.getAll('moods');
  const oldMoods = allMoods.filter(m => new Date(m.created_at) < cutoffDate);

  for (const mood of oldMoods) {
    await db.delete('moods', mood.id);
  }

  if (oldMoods.length > 0) {
    console.log(`[Offline] Evicted ${oldMoods.length} old moods`);
  }
};

// === MEDITATIONS ===

export const downloadMeditationOffline = async (
  id: string,
  title: string,
  audioUrl: string
): Promise<void> => {
  const db = await openOfflineDB();

  // Check if already downloaded
  const existing = await db.get('meditations', id);
  if (existing) {
    console.log('[Offline] Meditation already downloaded');
    return;
  }

  // Check quota before download
  const currentSize = await getTotalStorageSize();
  if (currentSize >= STORAGE_QUOTAS.MAX_TOTAL) {
    throw new Error('Storage quota exceeded. Please delete some downloads.');
  }

  // Download audio file
  const response = await fetch(audioUrl);
  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const blob = await response.blob();
  const size = blob.size;

  // Check if this download would exceed quota
  if (currentSize + size > STORAGE_QUOTAS.MAX_TOTAL) {
    // Try to make space with LRU eviction
    await evictLRUMeditation(size);
  }

  await db.put('meditations', {
    id,
    title,
    audio_blob: blob,
    size,
    downloaded_at: new Date().toISOString(),
    last_accessed_at: new Date().toISOString(),
  });

  console.log(`[Offline] Downloaded meditation: ${title} (${(size / 1024 / 1024).toFixed(2)} MB)`);
};

export const getOfflineMeditation = async (id: string): Promise<Blob | null> => {
  const db = await openOfflineDB();
  const meditation = await db.get('meditations', id);

  if (meditation) {
    // Update last accessed timestamp
    meditation.last_accessed_at = new Date().toISOString();
    await db.put('meditations', meditation);
    return meditation.audio_blob;
  }

  return null;
};

export const getDownloadedMeditations = async (): Promise<any[]> => {
  const db = await openOfflineDB();
  return await db.getAll('meditations');
};

export const deleteMeditationOffline = async (id: string): Promise<void> => {
  const db = await openOfflineDB();
  await db.delete('meditations', id);
  console.log(`[Offline] Deleted meditation: ${id}`);
};

export const isMeditationDownloaded = async (id: string): Promise<boolean> => {
  const db = await openOfflineDB();
  const meditation = await db.get('meditations', id);
  return !!meditation;
};

// LRU eviction - remove least recently accessed meditation
const evictLRUMeditation = async (requiredSpace: number): Promise<void> => {
  const db = await openOfflineDB();
  const meditations = await db.getAllFromIndex('meditations', 'by-accessed');

  if (meditations.length === 0) {
    throw new Error('No meditations to evict. Storage quota exceeded.');
  }

  // Sort by last accessed (oldest first)
  meditations.sort((a, b) => 
    new Date(a.last_accessed_at).getTime() - new Date(b.last_accessed_at).getTime()
  );

  let freedSpace = 0;
  const toDelete: string[] = [];

  for (const meditation of meditations) {
    toDelete.push(meditation.id);
    freedSpace += meditation.size;

    if (freedSpace >= requiredSpace) {
      break;
    }
  }

  for (const id of toDelete) {
    await db.delete('meditations', id);
  }

  console.log(`[Offline] Evicted ${toDelete.length} meditation(s) to free ${(freedSpace / 1024 / 1024).toFixed(2)} MB`);
};

// === STORAGE MANAGEMENT ===

export const getTotalStorageSize = async (): Promise<number> => {
  const db = await openOfflineDB();

  const journals = await db.getAll('journals');
  const journalSize = journals.reduce((sum, j) => sum + (j.size || 0), 0);

  const meditations = await db.getAll('meditations');
  const meditationSize = meditations.reduce((sum, m) => sum + m.size, 0);

  return journalSize + meditationSize;
};

export const getStorageStats = async () => {
  const db = await openOfflineDB();

  const journals = await db.getAll('journals');
  const journalSize = journals.reduce((sum, j) => sum + (j.size || 0), 0);

  const moods = await db.getAll('moods');

  const meditations = await db.getAll('meditations');
  const meditationSize = meditations.reduce((sum, m) => sum + m.size, 0);

  const totalSize = journalSize + meditationSize;

  return {
    journals: {
      count: journals.length,
      size: journalSize,
    },
    moods: {
      count: moods.length,
    },
    meditations: {
      count: meditations.length,
      size: meditationSize,
    },
    total: {
      size: totalSize,
      quota: STORAGE_QUOTAS.MAX_TOTAL,
      percentUsed: (totalSize / STORAGE_QUOTAS.MAX_TOTAL) * 100,
    },
  };
};

export const clearAllOfflineData = async (): Promise<void> => {
  const db = await openOfflineDB();

  await db.clear('journals');
  await db.clear('moods');
  await db.clear('meditations');
  await db.clear('metadata');

  console.log('[Offline] All offline data cleared');
};

// Check if storage API is available
export const checkStorageQuota = async () => {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage || 0,
      quota: estimate.quota || 0,
      percentUsed: estimate.quota ? ((estimate.usage || 0) / estimate.quota) * 100 : 0,
    };
  }
  return null;
};
