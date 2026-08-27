import { useState } from 'react'
import AdminLogin from './AdminLogin'
import AdminLayout from './AdminLayout'

export default function AdminApp() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('gif_admin') === 'true')

  if (!authed) return <AdminLogin onLogin={() => { sessionStorage.setItem('gif_admin', 'true'); setAuthed(true) }} />
  return <AdminLayout onLogout={() => { sessionStorage.removeItem('gif_admin'); setAuthed(false) }} />
}
