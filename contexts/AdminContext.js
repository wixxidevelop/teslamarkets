import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

export const useAdmin = () => {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Simple admin credentials (in production, use proper authentication)
  const ADMIN_USERNAME = 'admin'
  const ADMIN_PASSWORD = 'tesla2024'

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (username, password) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      localStorage.setItem('adminToken', 'authenticated')
      return { success: true }
    }
    return { success: false, error: 'Invalid credentials' }
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('adminToken')
  }

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}