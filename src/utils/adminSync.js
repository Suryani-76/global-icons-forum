import { idbGet, idbSet } from './mediaDb'
import initialAdminData from '../data/adminData.json'

export const STORE_MAPPINGS = {
  awards:        'gif_awards_data',
  announcements: 'gif_announcements_data',
  news:          'gif_news_items',
  newspaper:     'gif_newspaper_items',
  gallery:       'gif_gallery_images',
  executive:     'gif_executive_members',
  testimonials:  'gif_testimonials',
  chapters:      'gif_chapters_data',
  nominations:   'gif_nominations_data',
  settings:      'gif_site_settings',
}

/**
 * Gathers current state from both localStorage and IndexedDB across all 10 managers.
 */
export async function getAllAdminData() {
  if (typeof window === 'undefined') return initialAdminData

  const collected = { ...initialAdminData }

  for (const [prop, storageKey] of Object.entries(STORE_MAPPINGS)) {
    try {
      const defaultVal = initialAdminData[prop]
      const defaultLength = Array.isArray(defaultVal) ? defaultVal.length : 0

      // 1. Try IndexedDB first for high-fidelity state (especially photos)
      const idbVal = await idbGet(storageKey).catch(() => null)
      if (idbVal) {
        if (Array.isArray(idbVal)) {
          if (idbVal.length >= defaultLength) {
            collected[prop] = idbVal
            continue
          }
        } else if (typeof idbVal === 'object' && Object.keys(idbVal).length > 0) {
          collected[prop] = idbVal
          continue
        }
      }

      // 2. Fall back to localStorage
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (parsed) {
          if (Array.isArray(parsed)) {
            if (parsed.length >= defaultLength) {
              collected[prop] = parsed
              continue
            }
          } else if (typeof parsed === 'object' && Object.keys(parsed).length > 0) {
            collected[prop] = parsed
            continue
          }
        }
      }

      // Fallback: master baseline
      collected[prop] = defaultVal
    } catch (err) {
      console.warn(`Failed reading ${storageKey}:`, err)
    }
  }

  return collected
}

/**
 * Master reset function: restores all 10 managers to the complete baseline archives
 * across LocalStorage and IndexedDB, fires reactive events, and syncs to files.
 */
export async function restoreAllDefaultArchives() {
  if (typeof window === 'undefined') return false
  try {
    for (const [prop, storageKey] of Object.entries(STORE_MAPPINGS)) {
      const defaultVal = initialAdminData[prop]
      if (defaultVal) {
        try {
          localStorage.setItem(storageKey, JSON.stringify(defaultVal))
        } catch (e) {
          console.warn(`localStorage save error for ${storageKey}:`, e)
        }
        await idbSet(storageKey, defaultVal).catch(() => {})
      }
    }

    // Reactive dispatch for open tabs & UI components
    window.dispatchEvent(new CustomEvent('gif_gallery_updated', { detail: initialAdminData.gallery }))
    window.dispatchEvent(new CustomEvent('gif_newspaper_updated', { detail: initialAdminData.newspaper }))
    window.dispatchEvent(new CustomEvent('gif_news_updated', { detail: initialAdminData.news }))
    window.dispatchEvent(new CustomEvent('gif_testimonials_updated', { detail: initialAdminData.testimonials }))
    window.dispatchEvent(new CustomEvent('gif_executive_updated', { detail: initialAdminData.executive }))
    window.dispatchEvent(new CustomEvent('gif_awards_updated', { detail: initialAdminData.awards }))
    window.dispatchEvent(new CustomEvent('gif_chapters_updated', { detail: initialAdminData.chapters }))
    window.dispatchEvent(new CustomEvent('gif_nominations_updated', { detail: initialAdminData.nominations }))
    window.dispatchEvent(new CustomEvent('gif_settings_updated', { detail: initialAdminData.settings }))
    window.dispatchEvent(new CustomEvent('gif_announcements_updated', { detail: initialAdminData.announcements }))

    // Sync to codebase disk file
    await syncAdminToCodebase().catch(() => {})
    return true
  } catch (err) {
    console.error('Failed to restore all archives:', err)
    return false
  }
}

/**
 * Pushes the browser's current admin data to the local Vite dev server
 * which writes it directly to disk (src/data/adminData.json) so Git tracks it!
 */
export async function syncAdminToCodebase() {
  if (typeof window === 'undefined') return { success: false, message: 'SSR environment' }

  try {
    const data = await getAllAdminData()
    const res = await fetch('/api/sync-admin-to-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })

    if (!res.ok) {
      throw new Error(`Sync endpoint returned status ${res.status}`)
    }

    const json = await res.json()
    console.log('[AdminSync] Successfully synced admin data to codebase files:', json)
    return { success: true, message: 'Saved to codebase files (Ready for Git push)' }
  } catch (err) {
    console.warn('[AdminSync] Sync notice (server may not be running in dev mode):', err)
    return { success: false, message: err.message }
  }
}

/**
 * Exports current admin data as a downloadable JSON file
 */
export async function exportAdminBackup() {
  const data = await getAllAdminData()
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `gif-admin-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Imports an admin data backup into localStorage & IndexedDB
 */
export async function importAdminBackup(jsonFile) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        for (const [prop, storageKey] of Object.entries(STORE_MAPPINGS)) {
          if (parsed[prop]) {
            localStorage.setItem(storageKey, JSON.stringify(parsed[prop]))
          }
        }
        // Notify all open stores
        window.dispatchEvent(new CustomEvent('gif_awards_updated', { detail: parsed.awards }))
        window.dispatchEvent(new CustomEvent('gif_announcements_updated', { detail: parsed.announcements }))
        window.dispatchEvent(new CustomEvent('gif_news_updated', { detail: parsed.news }))
        window.dispatchEvent(new CustomEvent('gif_newspaper_updated', { detail: parsed.newspaper }))
        window.dispatchEvent(new CustomEvent('gif_gallery_updated', { detail: parsed.gallery }))
        window.dispatchEvent(new CustomEvent('gif_executive_updated', { detail: parsed.executive }))
        window.dispatchEvent(new CustomEvent('gif_testimonials_updated', { detail: parsed.testimonials }))
        window.dispatchEvent(new CustomEvent('gif_chapters_updated', { detail: parsed.chapters }))
        window.dispatchEvent(new CustomEvent('gif_nominations_updated', { detail: parsed.nominations }))
        window.dispatchEvent(new CustomEvent('gif_settings_updated', { detail: parsed.settings }))

        // Also sync to codebase
        await syncAdminToCodebase()

        resolve({ success: true })
      } catch (err) {
        reject(err)
      }
    }
    reader.readAsText(jsonFile)
  })
}
