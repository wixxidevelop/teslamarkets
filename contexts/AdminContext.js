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

  // Default admin credentials
  const DEFAULT_USERNAME = 'admin'
  const DEFAULT_PASSWORD = 'tesla2024'

  // Get stored credentials or use defaults
  const getStoredCredentials = () => {
    if (typeof window !== 'undefined') {
      const storedUsername = localStorage.getItem('adminUsername') || DEFAULT_USERNAME
      const storedPassword = localStorage.getItem('adminPassword') || DEFAULT_PASSWORD
      return { username: storedUsername, password: storedPassword }
    }
    return { username: DEFAULT_USERNAME, password: DEFAULT_PASSWORD }
  }

  useEffect(() => {
    // Check if admin is already logged in
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = (username, password) => {
    const credentials = getStoredCredentials()
    if (username === credentials.username && password === credentials.password) {
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

  const changePassword = (currentPassword, newPassword, confirmPassword) => {
    const credentials = getStoredCredentials()
    
    // Validate current password
    if (currentPassword !== credentials.password) {
      return { success: false, error: 'Current password is incorrect' }
    }
    
    // Validate new password
    if (newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long' }
    }
    
    // Validate password confirmation
    if (newPassword !== confirmPassword) {
      return { success: false, error: 'New passwords do not match' }
    }
    
    // Save new password
    localStorage.setItem('adminPassword', newPassword)
    return { success: true, message: 'Password changed successfully' }
  }

  const changeUsername = (newUsername, password) => {
    const credentials = getStoredCredentials()
    
    // Validate current password
    if (password !== credentials.password) {
      return { success: false, error: 'Password is incorrect' }
    }
    
    // Validate new username
    if (newUsername.length < 3) {
      return { success: false, error: 'Username must be at least 3 characters long' }
    }
    
    // Save new username
    localStorage.setItem('adminUsername', newUsername)
    return { success: true, message: 'Username changed successfully' }
  }

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
    changePassword,
    changeUsername,
    getStoredCredentials
  }

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  )
}