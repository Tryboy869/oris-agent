// memory.js — Gestion mémoire bidirectionnelle IndexedDB ↔ GitHub
// L'IA peut modifier ce fichier pour étendre ses capacités de mémoire

const ORIS_STORE = 'oris_state';
const DB_NAME    = 'ORIS_DB';
const DB_VERSION = 1;

let db = null;

async function openDB() {
  if (db) return db;
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = e => {
      const d = e.target.result;
      if (!d.objectStoreNames.contains(ORIS_STORE)) {
        d.createObjectStore(ORIS_STORE, { keyPath: 'key' });
      }
    };
    req.onsuccess = e => { db = e.target.result; resolve(db); };
    req.onerror   = e => reject(e.target.error);
  });
}

async function memSet(key, value) {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = d.transaction(ORIS_STORE, 'readwrite');
    const req = tx.objectStore(ORIS_STORE).put({ key, value, ts: Date.now() });
    req.onsuccess = () => resolve(true);
    req.onerror   = e => reject(e.target.error);
  });
}

async function memGet(key) {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = d.transaction(ORIS_STORE, 'readonly');
    const req = tx.objectStore(ORIS_STORE).get(key);
    req.onsuccess = e => resolve(e.target.result?.value ?? null);
    req.onerror   = e => reject(e.target.error);
  });
}

async function memGetAll() {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = d.transaction(ORIS_STORE, 'readonly');
    const req = tx.objectStore(ORIS_STORE).getAll();
    req.onsuccess = e => resolve(e.target.result || []);
    req.onerror   = e => reject(e.target.error);
  });
}

async function memDelete(key) {
  const d = await openDB();
  return new Promise((resolve, reject) => {
    const tx  = d.transaction(ORIS_STORE, 'readwrite');
    const req = tx.objectStore(ORIS_STORE).delete(key);
    req.onsuccess = () => resolve(true);
    req.onerror   = e => reject(e.target.error);
  });
}

// Sync IndexedDB → GitHub (tous les fichiers oris-dev/)
async function syncToGithub(githubFn) {
  try {
    const all = await memGetAll();
    const mdFiles = all.filter(e => e.key.startsWith('oris-dev/'));
    let synced = 0;
    for (const entry of mdFiles) {
      const ok = await githubFn(entry.key, entry.value, `[ORIS sync] ${entry.key}`);
      if (ok) synced++;
    }
    return synced;
  } catch(e) {
    console.warn('syncToGithub failed:', e);
    return 0;
  }
}

// Sync GitHub → IndexedDB (fallback si IndexedDB vide ou corrompu)
async function syncFromGithub(githubReadFn, files) {
  let loaded = 0;
  for (const filePath of files) {
    try {
      const content = await githubReadFn(filePath);
      if (content) {
        await memSet(filePath, content);
        loaded++;
      }
    } catch(e) {
      console.warn('syncFromGithub failed for', filePath, e);
    }
  }
  return loaded;
}

window.ORIS_MEMORY = { memSet, memGet, memGetAll, memDelete, syncToGithub, syncFromGithub };
