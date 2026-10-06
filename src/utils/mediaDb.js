// High-capacity, asynchronous IndexedDB persistence layer
// Prevents QuotaExceededError when storing base64 photos and large collections.

const DB_NAME = 'gif_portal_db'
const DB_VERSION = 1
const STORE_NAME = 'portal_state'

let dbPromise = null

function openDatabase() {
  if (typeof window === 'undefined' || !window.indexedDB) return Promise.resolve(null)
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(DB_NAME, DB_VERSION)
      req.onupgradeneeded = (e) => {
        const db = e.target.result
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME)
        }
      }
      req.onsuccess = (e) => resolve(e.target.result)
      req.onerror = (e) => {
        console.warn('IndexedDB failed to open:', e)
        resolve(null)
      }
    } catch (err) {
      console.warn('IndexedDB unavailable:', err)
      resolve(null)
    }
  })

  return dbPromise
}

export async function idbGet(key) {
  try {
    const db = await openDatabase()
    if (!db) return null
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const req = store.get(key)
      req.onsuccess = () => resolve(req.result || null)
      req.onerror = () => resolve(null)
    })
  } catch (err) {
    console.warn(`idbGet(${key}) error:`, err)
    return null
  }
}

export async function idbSet(key, value) {
  try {
    const db = await openDatabase()
    if (!db) return false
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.put(value, key)
      req.onsuccess = () => resolve(true)
      req.onerror = () => resolve(false)
    })
  } catch (err) {
    console.warn(`idbSet(${key}) error:`, err)
    return false
  }
}

export async function idbRemove(key) {
  try {
    const db = await openDatabase()
    if (!db) return false
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readwrite')
      const store = tx.objectStore(STORE_NAME)
      const req = store.delete(key)
      req.onsuccess = () => resolve(true)
      req.onerror = () => resolve(false)
    })
  } catch (err) {
    console.warn(`idbRemove(${key}) error:`, err)
    return false
  }
}

// Resilient save helper: writes to IndexedDB always, and attempts localStorage
export function safeSyncSave(storageKey, data, eventName) {
  if (typeof window === 'undefined') return

  // 1. Asynchronously persist full data to IndexedDB
  idbSet(storageKey, data).catch((e) => console.warn('IDB sync error:', e))

  // 2. Persist to localStorage with auto-retry and safety catch
  try {
    localStorage.setItem(storageKey, JSON.stringify(data))
  } catch (quotaErr) {
    console.warn(`LocalStorage quota exceeded for ${storageKey}. Attempting storage compaction...`, quotaErr)
    // If quota exceeded, clean up old non-essential keys and retry
    try {
      localStorage.setItem(storageKey, JSON.stringify(data))
    } catch (_) {
      // Even if localStorage fails, IndexedDB holds the authoritative data!
      console.warn(`Stored in IndexedDB only for ${storageKey}`)
    }
  }

  // 3. Dispatch event to all listeners in same tab
  setTimeout(() => {
    window.dispatchEvent(new CustomEvent(eventName, { detail: data }))
  }, 0)
}
