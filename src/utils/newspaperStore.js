import { useState, useEffect, useCallback } from 'react'
import initialAdminData from '../data/adminData.json'

export const DEFAULT_NEWSPAPER_ITEMS = (initialAdminData && initialAdminData.newspaper) || [
  { id: 1,  photo: '/newspicture 1.jpeg', headline: 'Global Icons Forum Society Launches National Summit',         publication: 'Deccan Chronicle', date: '2025-03-10', category: 'Summit',    status: 'Published' },
  { id: 2,  photo: '/newspicture 2.jpeg', headline: 'Vijayawada Icons Honoured at Global Forum Ceremony',          publication: 'Eenadu',           date: '2025-04-18', category: 'Awards',    status: 'Published' },
  { id: 3,  photo: '/newspicture 3.jpeg', headline: 'Global Icons Forum Receives ISO 9001:2015 Certification',     publication: 'The Hindu',        date: '2026-07-20', category: 'Milestone', status: 'Published' },
  { id: 4,  photo: '/newspicture 4.jpeg', headline: 'Super Star Krishna Awards 2025 — A Grand Celebration',        publication: 'Sakshi',           date: '2025-02-14', category: 'Awards',    status: 'Published' },
  { id: 5,  photo: '/newspicture 5.jpeg', headline: 'GIF Society Expands Chapters Across South India',             publication: 'Andhra Jyothy',    date: '2025-06-05', category: 'Expansion', status: 'Published' },
  ...Array.from({ length: 25 }, (_, i) => ({
    id: i + 6,
    photo: `/news${i + 1}.jpeg`,
    headline: 'News Coverage — Global Icons Forum',
    publication: 'Media Coverage',
    date: `2025-01-${String(i + 1).padStart(2, '0')}`,
    category: 'Media',
    status: 'Published',
  })),
]

import { idbGet, idbRemove, safeSyncSave } from './mediaDb'

const STORAGE_KEY = 'gif_newspaper_items'
const EVENT_NAME = 'gif_newspaper_updated'

export function mergeNewspaperWithDefaults(current) {
  if (!Array.isArray(current) || current.length === 0) return DEFAULT_NEWSPAPER_ITEMS
  if (current.length >= DEFAULT_NEWSPAPER_ITEMS.length) return current
  const existingIds = new Set(current.map(p => p.id).filter(Boolean))
  const existingPhotos = new Set(current.map(p => p.photo).filter(Boolean))
  const missing = DEFAULT_NEWSPAPER_ITEMS.filter(d => !existingIds.has(d.id) && !existingPhotos.has(d.photo))
  return [...current, ...missing]
}

export function getNewspaperItems() {
  if (typeof window === 'undefined') return DEFAULT_NEWSPAPER_ITEMS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_NEWSPAPER_ITEMS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length >= DEFAULT_NEWSPAPER_ITEMS.length) {
      return parsed
    }
    if (Array.isArray(parsed) && parsed.length > 0) {
      const combined = mergeNewspaperWithDefaults(parsed)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(combined))
      return combined
    }
  } catch (err) {
    console.error('Failed to parse newspaper items:', err)
  }
  return DEFAULT_NEWSPAPER_ITEMS
}

export function saveNewspaperItems(items) {
  safeSyncSave(STORAGE_KEY, items, EVENT_NAME)
}

export function resetNewspaperItems() {
  if (typeof window === 'undefined') return DEFAULT_NEWSPAPER_ITEMS
  try {
    localStorage.removeItem(STORAGE_KEY)
    idbRemove(STORAGE_KEY).catch(() => {})
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_NEWSPAPER_ITEMS }))
    }, 0)
  } catch (err) {
    console.error('Failed to reset newspaper items:', err)
  }
  return DEFAULT_NEWSPAPER_ITEMS
}

export function useNewspaperItems() {
  const [items, setItemsState] = useState(getNewspaperItems)

  useEffect(() => {
    idbGet(STORAGE_KEY).then((stored) => {
      if (Array.isArray(stored) && stored.length > 0) {
        if (stored.length < DEFAULT_NEWSPAPER_ITEMS.length) {
          const merged = mergeNewspaperWithDefaults(stored)
          setItemsState(merged)
          safeSyncSave(STORAGE_KEY, merged, EVENT_NAME)
        } else {
          setItemsState(stored)
        }
      } else {
        safeSyncSave(STORAGE_KEY, getNewspaperItems(), EVENT_NAME)
      }
    }).catch(() => {})

    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setItemsState(e.detail)
      } else {
        setItemsState(getNewspaperItems())
      }
    }
    const handleStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY) {
        setItemsState(getNewspaperItems())
      }
    }
    window.addEventListener(EVENT_NAME, handleUpdate)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const setItems = useCallback((updater) => {
    setItemsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      queueMicrotask(() => {
        saveNewspaperItems(next)
      })
      return next
    })
  }, [])

  const resetToDefaults = useCallback(() => {
    const def = resetNewspaperItems()
    setItemsState(def)
  }, [])

  return [items, setItems, resetToDefaults]
}
