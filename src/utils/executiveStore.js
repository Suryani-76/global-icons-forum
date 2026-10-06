import { useState, useEffect, useCallback } from 'react'

export const DEFAULT_EXECUTIVE_MEMBERS = [
  { id: 1, name: 'Mr. Chaitanya Janga',          designation: 'President',       photo: '/president.jpg' },
  { id: 2, name: 'Mrs. Jaya Pateriya',            designation: 'Secretary',       photo: '/exec-jaya-pateriya.jpeg' },
  { id: 3, name: 'Mr. Mithana Eswara Rao',        designation: 'Vice-President',  photo: '/gallery21.jpeg' },
  { id: 4, name: 'Mr. Kode Sri Chaitanya',        designation: 'Joint Secretary', photo: '/gallery22.jpeg' },
  { id: 5, name: 'Mr. Ramisetty Venkata Apparao', designation: 'Treasurer',       photo: '/exec-ramisetty.jpeg' },
  { id: 6, name: 'Dr. Animelli Naveen',           designation: 'Member',          photo: '/exec-animelli-naveen.jpeg' },
  { id: 7, name: 'Mr. Battula Dhanista',          designation: 'Member',          photo: '/exec-battula.jpeg' },
  { id: 8, name: 'Mr. Emmanuel',                  designation: 'Member',          photo: '/exec-emmanuel.jpeg' },
  { id: 9, name: 'Mr. Syed Ghouseuddin',          designation: 'Member',          photo: '/exec-syed.jpeg' },
]

import { idbGet, safeSyncSave } from './mediaDb'

const STORAGE_KEY = 'gif_executive_members'
const EVENT_NAME = 'gif_executive_updated'

export function getExecutiveMembers() {
  if (typeof window === 'undefined') return DEFAULT_EXECUTIVE_MEMBERS
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_EXECUTIVE_MEMBERS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed
    }
  } catch (err) {
    console.error('Failed to parse executive members:', err)
  }
  return DEFAULT_EXECUTIVE_MEMBERS
}

export function saveExecutiveMembers(members) {
  safeSyncSave(STORAGE_KEY, members, EVENT_NAME)
}

export function useExecutiveMembers() {
  const [members, setMembersState] = useState(getExecutiveMembers)

  useEffect(() => {
    idbGet(STORAGE_KEY).then((stored) => {
      if (Array.isArray(stored) && stored.length > 0) {
        setMembersState(stored)
      }
    }).catch(() => {})

    const handleUpdate = (e) => {
      if (e.detail && Array.isArray(e.detail)) {
        setMembersState(e.detail)
      } else {
        setMembersState(getExecutiveMembers())
      }
    }
    const handleStorage = (e) => {
      if (!e.key || e.key === STORAGE_KEY) {
        setMembersState(getExecutiveMembers())
      }
    }
    window.addEventListener(EVENT_NAME, handleUpdate)
    window.addEventListener('storage', handleStorage)
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const setMembers = useCallback((updater) => {
    setMembersState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      queueMicrotask(() => {
        saveExecutiveMembers(next)
      })
      return next
    })
  }, [])

  return [members, setMembers]
}
