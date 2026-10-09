import { useState, useEffect, useCallback } from 'react'
import initialAdminData from '../data/adminData.json'
import { syncAdminToCodebase } from './adminSync'

export const DEFAULT_AWARDS = (initialAdminData && initialAdminData.awards) || [
  {
    id: 1,
    color: 'blue',
    title: 'Global Icon of the Year',
    category: 'Leadership & Vision',
    desc: 'The highest honour bestowed upon an individual who has demonstrated extraordinary global impact, leadership, and humanitarian vision.',
    active: true,
  },
  {
    id: 2,
    color: 'orange',
    title: 'Excellence in Innovation',
    category: 'Science & Technology',
    desc: 'Recognising pioneers whose technological and scientific breakthroughs are transforming industries and improving lives worldwide.',
    active: true,
  },
  {
    id: 3,
    color: 'blue',
    title: 'Peace & Diplomacy Award',
    category: 'Diplomacy & Peace',
    desc: 'Celebrating leaders who have made exceptional contributions to international peace, cross-cultural dialogue, and conflict resolution.',
    active: true,
  },
  {
    id: 4,
    color: 'orange',
    title: 'Humanitarian Leadership',
    category: 'Social Impact',
    desc: 'Honouring those who selflessly dedicate their resources and influence toward alleviating suffering and uplifting communities.',
    active: true,
  },
  {
    id: 5,
    color: 'blue',
    title: 'Business Icon of the Decade',
    category: 'Business & Entrepreneurship',
    desc: 'Presented to visionary entrepreneurs and executives who have reshaped global commerce with integrity and transformative impact.',
    active: true,
  },
  {
    id: 6,
    color: 'orange',
    title: 'Cultural Excellence Award',
    category: 'Arts & Culture',
    desc: 'Celebrating icons in arts, culture, and heritage who preserve and propagate the richness of human civilisation across borders.',
    active: true,
  },
]

const STORAGE_KEY = 'gif_awards_data'
const EVENT_NAME = 'gif_awards_updated'

export function getAwards() {
  if (typeof window === 'undefined') return DEFAULT_AWARDS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_AWARDS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch (err) {
    console.error('Failed to parse awards:', err)
  }
  return DEFAULT_AWARDS
}

export function saveAwards(items) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: items }))
      if (import.meta.env.DEV) {
        syncAdminToCodebase()
      }
    }, 0)
  } catch (err) {
    console.error('Failed to save awards:', err)
  }
}

export function useAwards() {
  const [items, setItemsState] = useState(getAwards)

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setItemsState(e.detail)
      } else {
        setItemsState(getAwards())
      }
    }

    const handleStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY) {
        setItemsState(getAwards())
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
        saveAwards(next)
      })
      return next
    })
  }, [])

  return [items, setItems]
}
