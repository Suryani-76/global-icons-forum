import { useState, useEffect, useCallback } from 'react'
import initialAdminData from '../data/adminData.json'

export const DEFAULT_GALLERY_IMAGES = (initialAdminData && initialAdminData.gallery) || [
  { id: 1, src: '/gallery14.jpeg', caption: 'Global Icons Forum — Award Ceremony' },
  { id: 2, src: '/gallery15.jpeg', caption: 'Global Icons Forum — Award Ceremony' },
  { id: 3, src: '/gallery20.jpeg', caption: 'Global Icons Forum — Award Ceremony' },
  { id: 4, src: '/gallery18.jpeg', caption: 'Global Icons Forum — Award Ceremony' },
  { id: 5, src: '/gallery19.jpeg', caption: 'Global Icons Forum — Award Ceremony' },
  ...Array.from({ length: 18 }, (_, i) => ({
    id: i + 6,
    src: `/photo ${i + 1}.jpeg`,
    caption: 'Global Icons Forum — Excellence Event',
  })),
]

import { idbGet, idbRemove, safeSyncSave } from './mediaDb'

const STORAGE_KEY = 'gif_gallery_images'
const EVENT_NAME = 'gif_gallery_updated'

export function getGalleryImages() {
  if (typeof window === 'undefined') return DEFAULT_GALLERY_IMAGES
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_GALLERY_IMAGES
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length >= DEFAULT_GALLERY_IMAGES.length) {
      return parsed
    }
    if (Array.isArray(parsed) && parsed.length > 0) {
      const existingIds = new Set(parsed.map(p => p.id))
      const missing = DEFAULT_GALLERY_IMAGES.filter(d => !existingIds.has(d.id))
      const combined = [...parsed, ...missing]
      localStorage.setItem(STORAGE_KEY, JSON.stringify(combined))
      return combined
    }
  } catch (err) {
    console.error('Failed to parse stored gallery images:', err)
  }
  return DEFAULT_GALLERY_IMAGES
}

export function saveGalleryImages(images) {
  safeSyncSave(STORAGE_KEY, images, EVENT_NAME)
}

export function resetGalleryImages() {
  if (typeof window === 'undefined') return DEFAULT_GALLERY_IMAGES
  try {
    localStorage.removeItem(STORAGE_KEY)
    idbRemove(STORAGE_KEY).catch(() => {})
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: DEFAULT_GALLERY_IMAGES }))
    }, 0)
  } catch (err) {
    console.error('Failed to reset gallery images:', err)
  }
  return DEFAULT_GALLERY_IMAGES
}

export function useGalleryImages() {
  const [images, setImagesState] = useState(getGalleryImages)

  useEffect(() => {
    idbGet(STORAGE_KEY).then((stored) => {
      if (Array.isArray(stored) && stored.length > 0) {
        setImagesState(stored)
      }
    }).catch(() => {})

    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setImagesState(e.detail)
      } else {
        setImagesState(getGalleryImages())
      }
    }

    const handleStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY) {
        setImagesState(getGalleryImages())
      }
    }

    window.addEventListener(EVENT_NAME, handleUpdate)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const setImages = useCallback((updater) => {
    setImagesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      queueMicrotask(() => {
        saveGalleryImages(next)
      })
      return next
    })
  }, [])

  const resetToDefaults = useCallback(() => {
    const def = resetGalleryImages()
    setImagesState(def)
  }, [])

  return [images, setImages, resetToDefaults]
}
