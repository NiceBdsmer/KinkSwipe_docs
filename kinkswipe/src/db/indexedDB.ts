import type { ActivityDef, CustomCategory, RatingValue } from '../types';

const DB_NAME = 'KinkSwipeDB';
const DB_VERSION = 1;

const STORES = {
  ACTIVITIES: 'activities',
  ACTIVITY_CACHE: 'activity_cache',
  CUSTOM_CATEGORIES: 'custom_categories',
  RATINGS: 'ratings',
  SETTINGS: 'settings'
} as const;

type StoreName = typeof STORES[keyof typeof STORES];

class IndexedDBManager {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<void> | null = null;

  async init(): Promise<void> {
    if (this.initPromise) return this.initPromise;
    if (this.db) return Promise.resolve();

    this.initPromise = new Promise((resolve, reject) => {
      const request = (window as any).indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains(STORES.ACTIVITIES)) {
          db.createObjectStore(STORES.ACTIVITIES, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.ACTIVITY_CACHE)) {
          const cacheStore = db.createObjectStore(STORES.ACTIVITY_CACHE, { keyPath: 'id' });
          cacheStore.createIndex('category', 'categoryId', { unique: false });
          cacheStore.createIndex('lang', 'lang', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.CUSTOM_CATEGORIES)) {
          db.createObjectStore(STORES.CUSTOM_CATEGORIES, { keyPath: 'id' });
        }

        if (!db.objectStoreNames.contains(STORES.RATINGS)) {
          const ratingsStore = db.createObjectStore(STORES.RATINGS, { keyPath: 'mode' });
          ratingsStore.createIndex('updated', 'updatedAt', { unique: false });
        }

        if (!db.objectStoreNames.contains(STORES.SETTINGS)) {
          db.createObjectStore(STORES.SETTINGS, { keyPath: 'key' });
        }
      };
    });

    return this.initPromise;
  }

  async getAll<T>(storeName: StoreName): Promise<T[]> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: StoreName, key: IDBValidKey): Promise<T | undefined> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.get(key);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: StoreName, data: T): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(data);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async putMany<T>(storeName: StoreName, items: T[]): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);

      items.forEach(item => store.put(item));

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);
    });
  }

  async delete(storeName: StoreName, key: IDBValidKey): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: StoreName): Promise<void> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async getActivities(categoryId?: string, lang: string = 'en'): Promise<ActivityDef[]> {
    await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(STORES.ACTIVITY_CACHE, 'readonly');
      const store = transaction.objectStore(STORES.ACTIVITY_CACHE);

      let request: IDBRequest<(ActivityDef & { _lang?: string })[]>;

      if (categoryId) {
        const index = store.index('category');
        request = index.getAll(categoryId) as any;
      } else {
        request = store.getAll();
      }

      request.onsuccess = () => {
        const activities = request.result.filter(a => !a._lang || a._lang === lang).map(({ _lang, cachedAt, ...rest }: any) => rest);
        resolve(activities);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async cacheActivities(activities: ActivityDef[], lang: string = 'en'): Promise<void> {
    const activitiesWithMeta = activities.map(a => ({
      ...a,
      _lang: lang,
      cachedAt: Date.now()
    })) as (ActivityDef & { _lang: string; cachedAt: number })[];

    await this.putMany(STORES.ACTIVITY_CACHE, activitiesWithMeta);
  }

  async getCustomCategories(): Promise<CustomCategory[]> {
    return this.getAll(STORES.CUSTOM_CATEGORIES);
  }

  async addCustomCategory(category: CustomCategory): Promise<void> {
    await this.put(STORES.CUSTOM_CATEGORIES, category);
  }

  async updateCustomCategory(category: CustomCategory): Promise<void> {
    await this.put(STORES.CUSTOM_CATEGORIES, category);
  }

  async deleteCustomCategory(id: string): Promise<void> {
    await this.delete(STORES.CUSTOM_CATEGORIES, id);
  }

  async getRatings(mode: 'give' | 'receive'): Promise<Record<string, RatingValue>> {
    const result = await this.get<{ ratings: Record<string, RatingValue> }>(STORES.RATINGS, mode);
    return result?.ratings ?? {};
  }

  async setRatings(mode: 'give' | 'receive', ratings: Record<string, RatingValue>): Promise<void> {
    await this.put(STORES.RATINGS, {
      mode,
      ratings,
      updatedAt: Date.now()
    });
  }

  async getSetting<T>(key: string, defaultValue: T): Promise<T> {
    const result = await this.get<{ value: T }>(STORES.SETTINGS, key);
    return result?.value ?? defaultValue;
  }

  async setSetting<T>(key: string, value: T): Promise<void> {
    await this.put(STORES.SETTINGS, { key, value });
  }

  async clearAll(): Promise<void> {
    for (const storeName of Object.values(STORES)) {
      await this.clear(storeName as StoreName);
    }
  }
}

export const indexedDB = new IndexedDBManager();
export const STORES_CONSTANTS = STORES;
