import { Letter } from "./types";

const LEGACY_KEY = "letters_to_eternity_v1";
const PRIMARY_KEY = "letters_to_eternity_stars_v1";
const BACKUP_KEY = "solashaven_stars_backup_v1";
const MASTER_KEY = "solashaven_master_stars_store";

const MY_STARS_PRIMARY = "letters_to_eternity_my_stars_v1";
const MY_STARS_BACKUP = "solashaven_my_stars_backup_v1";

const DB_NAME = "SolasHavenSanctuaryDB";
const DB_VERSION = 1;
const STORE_NAME = "celestial_stars";

// Open or initialize browser IndexedDB for permanent survival across updates
function openIndexedDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: "id" });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

// Read stars from IndexedDB
async function readStarsFromDB(): Promise<Letter[]> {
  const db = await openIndexedDB();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction(STORE_NAME, "readonly");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        resolve(Array.isArray(request.result) ? request.result : []);
      };

      request.onerror = () => {
        resolve([]);
      };
    } catch {
      resolve([]);
    }
  });
}

// Write stars to IndexedDB
async function writeStarsToDB(stars: Letter[]): Promise<void> {
  const db = await openIndexedDB();
  if (!db) return;

  try {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    stars.forEach((star) => {
      try {
        store.put(star);
      } catch {}
    });
  } catch {}
}

export async function loadPersistedStars(
  initialStars: Letter[]
): Promise<{ allStars: Letter[]; myStarIds: string[] }> {
  const collectedStars = new Map<string, Letter>();

  // 1. Initial pre-seeded stars
  initialStars.forEach((star) => collectedStars.set(star.id, star));

  // 2. Read from all localStorage keys
  const keysToInspect = [LEGACY_KEY, PRIMARY_KEY, BACKUP_KEY, MASTER_KEY];
  keysToInspect.forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((item: Letter) => {
            if (item && item.id) {
              // User stars take absolute precedence over initial stars
              collectedStars.set(item.id, item);
            }
          });
        }
      }
    } catch {}
  });

  // 3. Read from IndexedDB (survives aggressive browser storage clears)
  try {
    const dbStars = await readStarsFromDB();
    dbStars.forEach((star) => {
      if (star && star.id) {
        collectedStars.set(star.id, star);
      }
    });
  } catch {}

  // 4. Read myStarIds across all keys
  const myIds = new Set<string>();
  [MY_STARS_PRIMARY, MY_STARS_BACKUP].forEach((key) => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((id: string) => myIds.add(id));
        }
      }
    } catch {}
  });

  const allStars = Array.from(collectedStars.values());
  const myStarIds = Array.from(myIds);

  // Sync back to all stores so any missing store is updated immediately
  try {
    const serialized = JSON.stringify(allStars);
    localStorage.setItem(LEGACY_KEY, serialized);
    localStorage.setItem(PRIMARY_KEY, serialized);
    localStorage.setItem(BACKUP_KEY, serialized);
    localStorage.setItem(MASTER_KEY, serialized);

    const serializedMy = JSON.stringify(myStarIds);
    localStorage.setItem(MY_STARS_PRIMARY, serializedMy);
    localStorage.setItem(MY_STARS_BACKUP, serializedMy);

    writeStarsToDB(allStars).catch(() => {});
  } catch {}

  return { allStars, myStarIds };
}

export async function persistNewStar(newStar: Letter, isMyStar = true): Promise<void> {
  try {
    // 1. Update localStorage across all mirror keys
    [LEGACY_KEY, PRIMARY_KEY, BACKUP_KEY, MASTER_KEY].forEach((key) => {
      try {
        const raw = localStorage.getItem(key);
        const existing = raw ? JSON.parse(raw) : [];
        const filtered = Array.isArray(existing) ? existing.filter((s: Letter) => s.id !== newStar.id) : [];
        localStorage.setItem(key, JSON.stringify([newStar, ...filtered]));
      } catch {}
    });

    // 2. Update myStars
    if (isMyStar) {
      [MY_STARS_PRIMARY, MY_STARS_BACKUP].forEach((key) => {
        try {
          const raw = localStorage.getItem(key);
          const existingIds = raw ? JSON.parse(raw) : [];
          const updated = Array.from(new Set([newStar.id, ...(Array.isArray(existingIds) ? existingIds : [])]));
          localStorage.setItem(key, JSON.stringify(updated));
        } catch {}
      });
    }

    // 3. Write to IndexedDB
    const db = await openIndexedDB();
    if (db) {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      store.put(newStar);
    }
  } catch (err) {
    console.error("Star persistence error:", err);
  }
}

export function syncStarsToAllTiers(stars: Letter[]): void {
  try {
    const serialized = JSON.stringify(stars);
    [LEGACY_KEY, PRIMARY_KEY, BACKUP_KEY, MASTER_KEY].forEach((key) => {
      try {
        localStorage.setItem(key, serialized);
      } catch {}
    });
    writeStarsToDB(stars).catch(() => {});
  } catch {}
}

export function exportUserStarsAsJSON(): string {
  try {
    const raw = localStorage.getItem(PRIMARY_KEY) || localStorage.getItem(BACKUP_KEY);
    return raw || "[]";
  } catch {
    return "[]";
  }
}
