import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { getMe } from '../services/api'

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading') // loading | authenticated | unauthenticated

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setStatus('unauthenticated')
      return
    }

    getMe()
      .then(() => setStatus('authenticated'))
      .catch(() => {
        localStorage.removeItem('token')
        setStatus('unauthenticated')
      })
  }, [])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600 dark:text-gray-400 text-sm">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />
  }

  return children
}
