import { useState, useEffect, useCallback } from 'react'

export const DEFAULT_NOMINATIONS = [
  { id: 1, name: 'Dr. Arjun Reddy',     email: 'arjun@example.com',   phone: '+91 98765 00001', category: 'Business & Entrepreneurship', date: '2026-07-10', status: 'Pending',     message: 'Founder of 3 successful startups across India and UAE.' },
  { id: 2, name: 'Ms. Preethi Nair',    email: 'preethi@example.com', phone: '+91 98765 00002', category: 'Arts & Culture',               date: '2026-07-12', status: 'Shortlisted', message: 'Award-winning classical dancer and choreographer.' },
  { id: 3, name: 'Mr. Vinod Sharma',    email: 'vinod@example.com',   phone: '+91 98765 00003', category: 'Social Impact',                date: '2026-07-14', status: 'Approved',    message: 'Runs 12 rural schools across Rajasthan.' },
  { id: 4, name: 'Dr. Meena Iyer',      email: 'meena@example.com',   phone: '+91 98765 00004', category: 'Health & Medicine',            date: '2026-07-15', status: 'Pending',     message: 'Pioneer in telemedicine for remote villages.' },
  { id: 5, name: 'Mr. Farhan Qureshi',  email: 'farhan@example.com',  phone: '+91 98765 00005', category: 'Science & Technology',         date: '2026-07-16', status: 'Rejected',    message: 'AI researcher at IIT Bombay.' },
  { id: 6, name: 'Ms. Sudha Krishnan',  email: 'sudha@example.com',   phone: '+91 98765 00006', category: 'Education',                    date: '2026-07-17', status: 'Pending',     message: 'Established literacy programs for 10,000+ women.' },
]

const STORAGE_KEY = 'gif_nominations_data'
const EVENT_NAME = 'gif_nominations_updated'

export function getNominations() {
  if (typeof window === 'undefined') return DEFAULT_NOMINATIONS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_NOMINATIONS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
  } catch (err) {
    console.error('Failed to parse nominations:', err)
  }
  return DEFAULT_NOMINATIONS
}

export function saveNominations(items) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: items }))
    }, 0)
  } catch (err) {
    console.error('Failed to save nominations:', err)
  }
}

export function addNomination(nom) {
  const current = getNominations()
  const next = [{ ...nom, id: Date.now(), date: new Date().toISOString().slice(0, 10), status: 'Pending' }, ...current]
  saveNominations(next)
  return next
}

export function useNominations() {
  const [items, setItemsState] = useState(getNominations)

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setItemsState(e.detail)
      } else {
        setItemsState(getNominations())
      }
    }

    const handleStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY) {
        setItemsState(getNominations())
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
        saveNominations(next)
      })
      return next
    })
  }, [])

  return [items, setItems, addNomination]
}
