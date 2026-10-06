import { useState, useEffect, useCallback } from 'react'

export const DEFAULT_SETTINGS = {
  contact: {
    phone: '+91-9014217124',
    email: 'info@oklut.com',
    headOffice: 'Second Floor, Samridhi Vasyam, D No 1/98/9/3/23, Capital Pk Rd, beside Narayana High School, Cyber Hills Colony, VIP Hills, Jaihind Enclave, Madhapur, Hyderabad, Telangana 500081',
    registeredOffice: '24-29-211, Durga Puram, Gulabi Thota Road, J Apparao Street, Vijayawada 520003, Andhra Pradesh',
  },
  social: {
    facebook:  'https://facebook.com/globaliconsforumsociety',
    instagram: 'https://instagram.com/globaliconsforumsociety',
    twitter:   'https://twitter.com/globaliconsGIF',
    youtube:   'https://youtube.com/@globaliconsforumsociety',
    linkedin:  'https://linkedin.com/company/globaliconsforumsociety',
  },
  iso: {
    certNo:   'QMS/26M05315',
    certBy:   'MQA Certification Services, London',
    location: '130 Thessaly Rd, Nine Elms, London SW8 5EJ, UK',
    issued:   '18 July 2026',
    expiry:   '17 July 2029',
    accred:   'UKAF-CB-011 · UKAF CERT LIMITED',
  },
  registration: {
    actName:  'Societies Registration Act 35/2001',
    nature:   'Non-Profit · No Commercial Activity',
    finYear:  'April 1st — March 31st',
  },
}

const STORAGE_KEY = 'gif_site_settings'
const EVENT_NAME = 'gif_settings_updated'

export function getSiteSettings() {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_SETTINGS
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object') return { ...DEFAULT_SETTINGS, ...parsed }
  } catch (err) {
    console.error('Failed to parse site settings:', err)
  }
  return DEFAULT_SETTINGS
}

export function saveSiteSettings(data) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: data }))
    }, 0)
  } catch (err) {
    console.error('Failed to save site settings:', err)
  }
}

export function useSiteSettings() {
  const [data, setDataState] = useState(getSiteSettings)

  useEffect(() => {
    const handleUpdate = (e) => {
      if (e.detail && typeof e.detail === 'object') {
        setDataState(e.detail)
      } else {
        setDataState(getSiteSettings())
      }
    }

    const handleStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY) {
        setDataState(getSiteSettings())
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
        saveSiteSettings(next)
      })
      return next
    })
  }, [])

  return [data, setData]
}
