import { createContext, useContext, useState, useEffect } from 'react'
import authService from '../services/authService'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check auth status on app load
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('access_token')
      const savedUser = authService.getUser()

      if (token && savedUser) {
        setUser(savedUser)
        setIsAuthenticated(true)
      }
      setLoading(false)
    }
    initAuth()
  }, [])

  // Login with Google token
  const login = async (googleToken) => {
    try {
      const data = await authService.googleLogin(googleToken)
      authService.saveTokens(data.access, data.refresh)
      authService.saveUser(data.user)
      setUser(data.user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed'
      }
    }
  }

  // Logout
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      localStorage.clear()
    }
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext