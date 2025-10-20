import { v4 as uuidv4 } from 'uuid';

interface QueuedOperation {
  id: string;
  request: {
    url: string;
    method: string;
    body?: any;
    headers?: Record<string, string>;
  };
  timestamp: number;
}

const SYNC_QUEUE_NAME = 'peace-write-ops';
const DB_NAME = 'PeaceDB';
const STORE_NAME = 'syncQueue';

// Check if background sync is supported
export const isBackgroundSyncSupported = (): boolean => {
  return 'serviceWorker' in navigator && 'SyncManager' in window;
};

// Open IndexedDB
const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Add operation to sync queue
export const queueOperation = async (
  url: string,
  method: string,
  body?: any,
  headers?: Record<string, string>
): Promise<void> => {
  try {
    const operation: QueuedOperation = {
      id: uuidv4(),
      request: {
        url,
        method,
        body,
        headers,
      },
      timestamp: Date.now(),
    };

    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.add(operation);

    console.log('[BG Sync] Operation queued:', operation.id);

    // Register background sync if supported
    if (isBackgroundSyncSupported()) {
      const registration = await navigator.serviceWorker.ready;
      await (registration as any).sync.register(SYNC_QUEUE_NAME);
      console.log('[BG Sync] Sync registered');
    }
  } catch (error) {
    console.error('[BG Sync] Failed to queue operation:', error);
    throw error;
  }
};

// Get all queued operations
export const getQueuedOperations = async (): Promise<QueuedOperation[]> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('[BG Sync] Failed to get queued operations:', error);
    return [];
  }
};

// Clear completed operations
export const clearQueuedOperation = async (id: string): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.delete(id);
    console.log('[BG Sync] Operation cleared:', id);
  } catch (error) {
    console.error('[BG Sync] Failed to clear operation:', error);
  }
};

// Get queue size
export const getQueueSize = async (): Promise<number> => {
  try {
    const operations = await getQueuedOperations();
    return operations.length;
  } catch (error) {
    console.error('[BG Sync] Failed to get queue size:', error);
    return 0;
  }
};

// Clear all queued operations
export const clearAllQueued = async (): Promise<void> => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.clear();
    console.log('[BG Sync] All operations cleared');
  } catch (error) {
    console.error('[BG Sync] Failed to clear all operations:', error);
  }
};
