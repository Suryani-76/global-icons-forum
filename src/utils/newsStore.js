import { useState, useEffect, useCallback } from 'react'
import initialAdminData from '../data/adminData.json'

export const DEFAULT_NEWS_ITEMS = (initialAdminData && initialAdminData.news) || [
  {
    id: 1,
    title: 'State Icons Awards Night — 2026',
    category: 'Awards',
    date: '2026-08-08',
    status: 'Published',
    photo: '/events.jpeg',
    excerpt: 'Global Icons Forum Society organises the prestigious State Icons Awards Night 2026 at Hotel Hyatt Place, Gunadala, Vijayawada with distinguished ministers, delegates and cultural luminaries.',
  },
]

export function sanitizeNews(items) {
  if (!Array.isArray(items)) return DEFAULT_NEWS_ITEMS
  const filtered = items.filter(item => Boolean(item && item.title))
  return filtered.length > 0 ? filtered : DEFAULT_NEWS_ITEMS
}

import { idbGet, idbRemove, safeSyncSave } from './mediaDb'

const STORAGE_KEY = 'gif_news_items'
const EVENT_NAME = 'gif_news_updated'

export function getNewsItems() {
  if (typeof window === 'undefined') return DEFAULT_NEWS_ITEMS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_NEWS_ITEMS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length >= DEFAULT_NEWS_ITEMS.length) {
      return sanitizeNews(parsed)
    }
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map(p => p.id))
      const missing = DEFAULT_NEWS_ITEMS.filter(d => !existingIds.has(d.id))
      const combined = sanitizeNews([...parsed, ...missing])
      localStorage.setItem(STORAGE_KEY, JSON.stringify(combined))
      return combined
    }
  } catch (err) {
    console.error('Failed to parse news items:', err)
  }
  return DEFAULT_NEWS_ITEMS
}

export function saveNewsItems(items) {
  safeSyncSave(STORAGE_KEY, items, EVENT_NAME)
}

export function resetNewsItems() {
  if (typeof window === 'undefined') return DEFAULT_NEWS_ITEMS
  try {
    localStorage.removeItem(STORAGE_KEY)
    idbRemove(STORAGE_KEY).catch(() => {})
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_NEWS_ITEMS }))
    }, 0)
  } catch (err) {
    console.error('Failed to reset news items:', err)
  }
  return DEFAULT_NEWS_ITEMS
}

export function useNewsItems() {
  const [items, setItemsState] = useState(getNewsItems)

  useEffect(() => {
    // Hydrate from IndexedDB in case localStorage was trimmed or full
    idbGet(STORAGE_KEY).then((stored) => {
      if (Array.isArray(stored) && stored.length > 0) {
        const sanitized = sanitizeNews(stored)
        setItemsState(sanitized)
        if (sanitized.length !== stored.length) {
          saveNewsItems(sanitized)
        }
      }
    }).catch(() => {})

    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setItemsState(e.detail)
      } else {
        setItemsState(getNewsItems())
      }
    }

    const handleStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY) {
        setItemsState(getNewsItems())
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
        saveNewsItems(next)
      })
      return next
    })
  }, [])

  const resetToDefaults = useCallback(() => {
    const def = resetNewsItems()
    setItemsState(def)
  }, [])

  return [items, setItems, resetToDefaults]
}
