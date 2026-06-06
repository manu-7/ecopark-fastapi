import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(localStorage.getItem('token') || null)
  const [username, setUsername] = useState(localStorage.getItem('username') || null)
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem('is_admin') === 'true')

  const setToken = (newToken, newUsername, newIsAdmin = false) => {
    if (newToken) {
      localStorage.setItem('token', newToken)
      if (newUsername) {
        localStorage.setItem('username', newUsername)
        setUsername(newUsername)
      }
      localStorage.setItem('is_admin', String(newIsAdmin))
      setIsAdmin(newIsAdmin)
    } else {
      localStorage.removeItem('token')
      localStorage.removeItem('username')
      localStorage.removeItem('is_admin')
      setUsername(null)
      setIsAdmin(false)
    }
    setTokenState(newToken)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ token, username, isAdmin, setToken, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
