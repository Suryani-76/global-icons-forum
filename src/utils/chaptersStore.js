import { useState, useEffect, useCallback } from 'react'
import initialAdminData from '../data/adminData.json'
import { syncAdminToCodebase } from './adminSync'

export const DEFAULT_CHAPTERS = (initialAdminData && initialAdminData.chapters) || [
  { id: 1,  state: 'Andhra Pradesh', city: 'Vijayawada', type: 'Registered Office', status: 'Active', icon: '⭐', contact: 'Mr. Chaitanya Janga', email: 'vijayawada@gif.org', members: 45 },
  { id: 2,  state: 'Telangana',      city: 'Hyderabad',  type: 'Operating Office',  status: 'Active', icon: '⭐', contact: 'Mr. Ravi Kumar',      email: 'hyderabad@gif.org',  members: 38 },
  { id: 3,  state: 'Maharashtra',    city: 'Mumbai',     type: 'Chapter Office',    status: 'Active', icon: '🟢', contact: 'Ms. Anita Sharma',    email: 'mumbai@gif.org',     members: 27 },
  { id: 4,  state: 'Karnataka',      city: 'Bengaluru',  type: 'Chapter Office',    status: 'Active', icon: '🟢', contact: 'Mr. Harish Patel',    email: 'bengaluru@gif.org',  members: 22 },
  { id: 5,  state: 'Tamil Nadu',     city: 'Chennai',    type: 'Chapter Office',    status: 'Active', icon: '🟢', contact: 'Dr. Meena Iyer',      email: 'chennai@gif.org',    members: 19 },
  { id: 6,  state: 'Delhi NCR',      city: 'New Delhi',  type: 'Chapter Office',    status: 'Active', icon: '🟢', contact: 'Mr. Vinod Sharma',    email: 'delhi@gif.org',      members: 31 },
  { id: 7,  state: 'West Bengal',    city: 'Kolkata',    type: 'Chapter Office',    status: 'Upcoming', icon: '🔵', contact: 'Ms. Preethi Nair',  email: 'kolkata@gif.org',    members: 12 },
  { id: 8,  state: 'Gujarat',        city: 'Ahmedabad',  type: 'Chapter Office',    status: 'Upcoming', icon: '🔵', contact: 'Mr. Rajan Mehta',   email: 'gujarat@gif.org',    members: 15 },
  { id: 9,  state: 'United Kingdom', city: 'London',     type: 'International Chapter', status: 'Upcoming', icon: '🌍', contact: 'Mr. Emmanuel',     email: 'london@gif.org',     members: 9 },
  { id: 10, state: 'United States',  city: 'New York',   type: 'International Chapter', status: 'Upcoming', icon: '🌎', contact: 'Dr. Sofia Ramirez', email: 'ny@gif.org',         members: 7 },
]

const STORAGE_KEY = 'gif_chapters_data'
const EVENT_NAME = 'gif_chapters_updated'

export function getChapters() {
  if (typeof window === 'undefined') return DEFAULT_CHAPTERS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_CHAPTERS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch (err) {
    console.error('Failed to parse chapters:', err)
  }
  return DEFAULT_CHAPTERS
}

export function saveChapters(items) {
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
    console.error('Failed to save chapters:', err)
  }
}

export function useChapters() {
  const [items, setItemsState] = useState(getChapters)

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setItemsState(e.detail)
      } else {
        setItemsState(getChapters())
      }
    }

    const handleStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY) {
        setItemsState(getChapters())
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
        saveChapters(next)
      })
      return next
    })
  }, [])

  return [items, setItems]
}
