import { useState, useEffect, useCallback } from 'react'
import initialAdminData from '../data/adminData.json'

export const DEFAULT_TESTIMONIALS = (initialAdminData && initialAdminData.testimonials) || [
  {
    id: 1,
    photo: '/news1.jpeg',
    name: 'Dr. Priya Sharma',
    title: 'Global Innovator of the Year 2023',
    nation: 'India',
    color: '#ffffff',
    quote: 'Being recognised by the Global Icons Forum was a watershed moment in my career. The platform amplifies voices that are truly making a difference, and the energy in that room was unlike anything I have ever experienced.',
  },
  {
    id: 2,
    photo: '/news2.jpeg',
    name: 'Ambassador Jean-Paul Moreau',
    title: 'Peace & Diplomacy Awardee 2022',
    nation: 'France',
    color: '#e05a24',
    quote: 'The Global Icons Forum stands as a rare institution that genuinely bridges cultures and continents. This honour reaffirmed my belief that diplomacy and human connection are the most powerful tools we have for lasting peace.',
  },
  {
    id: 3,
    photo: '/news3.jpeg',
    name: 'Ms. Amara Osei',
    title: 'Humanitarian Leadership Award 2023',
    nation: 'Ghana',
    color: '#f7c430',
    quote: 'Receiving this award on behalf of thousands of women I work with across West Africa was deeply moving. The Forum shines a global spotlight on grassroots change-makers who rarely get the recognition they deserve.',
  },
  {
    id: 4,
    photo: '/news4.jpeg',
    name: 'Mr. Rajan Mehta',
    title: 'Business Icon of the Decade 2021',
    nation: 'Singapore',
    color: '#ffffff',
    quote: 'What sets the Global Icons Forum apart is the quality of the community it has built. Being part of this network has opened doors to collaborations across five continents and reshaped how I think about global business leadership.',
  },
  {
    id: 5,
    photo: '/news5.jpeg',
    name: 'Ms. Lakshmi Prasad',
    title: 'Cultural Excellence Awardee 2023',
    nation: 'India',
    color: '#e05a24',
    quote: 'Art transcends borders, and the Global Icons Forum truly embodies that spirit. This recognition gives impetus to our mission of taking Indian classical heritage to global stages.',
  },
  {
    id: 6,
    photo: '/news6.jpeg',
    name: 'Prof. David Kimani',
    title: 'Education Visionary Award 2023',
    nation: 'Kenya',
    color: '#f7c430',
    quote: 'The Global Icons Forum does not just hand out trophies — it creates a movement. The scholarship initiatives born out of this forum are already changing lives across East Africa.',
  },
]

import { idbGet, safeSyncSave } from './mediaDb'

const STORAGE_KEY = 'gif_testimonials'
const EVENT_NAME = 'gif_testimonials_updated'

export function mergeTestimonialsWithDefaults(current) {
  if (!Array.isArray(current) || current.length === 0) return DEFAULT_TESTIMONIALS
  if (current.length >= DEFAULT_TESTIMONIALS.length) return current
  const existingIds = new Set(current.map(p => p.id).filter(Boolean))
  const missing = DEFAULT_TESTIMONIALS.filter(d => !existingIds.has(d.id))
  return [...current, ...missing]
}

export function getTestimonials() {
  if (typeof window === 'undefined') return DEFAULT_TESTIMONIALS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_TESTIMONIALS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length >= DEFAULT_TESTIMONIALS.length) return parsed
    if (Array.isArray(parsed) && parsed.length > 0) {
      const combined = mergeTestimonialsWithDefaults(parsed)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(combined))
      return combined
    }
  } catch (err) {
    console.error('Failed to parse testimonials:', err)
  }
  return DEFAULT_TESTIMONIALS
}

export function saveTestimonials(items) {
  safeSyncSave(STORAGE_KEY, items, EVENT_NAME)
}

export function useTestimonials() {
  const [items, setItemsState] = useState(getTestimonials)

  useEffect(() => {
    idbGet(STORAGE_KEY).then((stored) => {
      if (Array.isArray(stored) && stored.length > 0) {
        if (stored.length < DEFAULT_TESTIMONIALS.length) {
          const merged = mergeTestimonialsWithDefaults(stored)
          setItemsState(merged)
          safeSyncSave(STORAGE_KEY, merged, EVENT_NAME)
        } else {
          setItemsState(stored)
        }
      } else {
        safeSyncSave(STORAGE_KEY, getTestimonials(), EVENT_NAME)
      }
    }).catch(() => {})

    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setItemsState(e.detail)
      } else {
        setItemsState(getTestimonials())
      }
    }

    const handleStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY) {
        setItemsState(getTestimonials())
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
        saveTestimonials(next)
      })
      return next
    })
  }, [])

  return [items, setItems]
}
