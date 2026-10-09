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

import { idbGet, safeSyncSave } from './mediaDb'

const STORAGE_KEY = 'gif_newspaper_items'
const EVENT_NAME = 'gif_newspaper_updated'

export function getNewspaperItems() {
  if (typeof window === 'undefined') return DEFAULT_NEWSPAPER_ITEMS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_NEWSPAPER_ITEMS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch (err) {
    console.error('Failed to parse newspaper items:', err)
  }
  return DEFAULT_NEWSPAPER_ITEMS
}

export function saveNewspaperItems(items) {
  safeSyncSave(STORAGE_KEY, items, EVENT_NAME)
}

export function useNewspaperItems() {
  const [items, setItemsState] = useState(getNewspaperItems)

  useEffect(() => {
    idbGet(STORAGE_KEY).then((stored) => {
      if (Array.isArray(stored) && stored.length > 0) {
        setItemsState(stored)
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

  return [items, setItems]
}
