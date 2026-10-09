import { useState, useEffect, useCallback } from 'react'
import initialAdminData from '../data/adminData.json'
import { syncAdminToCodebase } from './adminSync'

export const DEFAULT_ANNOUNCEMENTS = (initialAdminData && initialAdminData.announcements) || {
  hero: {
    tagline: 'Celebrating Excellence Across the Globe',
    subtext: 'The Global Icons Forum Society honours outstanding individuals and organisations for excellence at national and international levels.',
  },
  banners: [
    { id: 1, text: '🏆 Nominations Open for Global Icons Awards 2026 — Apply Now', accent: 'orange', active: true },
    { id: 2, text: '📅 National Summit 2026 — Coming September, Vijayawada', accent: 'blue', active: true },
    { id: 3, text: '🌐 ISO 9001:2015 Certified — MQA Certification Services, UK', accent: 'orange', active: true },
    { id: 4, text: '120+ Countries Represented Globally', accent: 'blue', active: true },
    { id: 5, text: '5,000+ Global Icons Recognised & Honoured', accent: 'orange', active: true },
    { id: 6, text: '18 Years of Excellence in Public Leadership & Honours', accent: 'blue', active: true },
  ],
  partners: [
    { id: 1, name: 'Ministry of Culture, India', active: true },
    { id: 2, name: 'UKAF Certification Limited, London', active: true },
    { id: 3, name: 'MQA Certification Services, UK', active: true },
    { id: 4, name: 'Andhra Pradesh Tourism & Heritage', active: true },
  ],
}

const STORAGE_KEY = 'gif_announcements_data'
const EVENT_NAME = 'gif_announcements_updated'

export function getAnnouncements() {
  if (typeof window === 'undefined') return DEFAULT_ANNOUNCEMENTS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_ANNOUNCEMENTS
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return { ...DEFAULT_ANNOUNCEMENTS, ...parsed }
  } catch (err) {
    console.error('Failed to parse announcements data:', err)
  }
  return DEFAULT_ANNOUNCEMENTS
}

export function saveAnnouncements(data) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }))
      if (import.meta.env.DEV) {
        syncAdminToCodebase()
      }
    }, 0)
  } catch (err) {
    console.error('Failed to save announcements data:', err)
  }
}

export function useAnnouncements() {
  const [data, setDataState] = useState(getAnnouncements)

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && typeof e.detail === 'object') {
        setDataState(e.detail)
      } else {
        setDataState(getAnnouncements())
      }
    }

    const handleStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY) {
        setDataState(getAnnouncements())
      }
    }

    window.addEventListener(EVENT_NAME, handleUpdate)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const setData = useCallback((updater) => {
    setDataState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      queueMicrotask(() => {
        saveAnnouncements(next)
      })
      return next
    })
  }, [])

  return [data, setData]
}
