import axiosInstance from '../utils/axiosConfig'
import { API_ENDPOINTS } from '../utils/constants'

const authService = {
  // Login with Google token
  googleLogin: async (googleToken) => {
    const response = await axiosInstance.post(API_ENDPOINTS.GOOGLE_AUTH, {
      token: googleToken,
    })
    return response.data
  },

  // Get current user details
  getUserDetails: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.USER_DETAIL)
    return response.data
  },

  // Logout
  logout: async () => {
    const refreshToken = localStorage.getItem('refresh_token')
    if (refreshToken) {
      await axiosInstance.post(API_ENDPOINTS.LOGOUT, {
        refresh: refreshToken,
      })
    }
    localStorage.clear()
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token')
  },

  // Save tokens to localStorage
  saveTokens: (access, refresh) => {
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  },

  // Save user to localStorage
  saveUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user))
  },

  // Get user from localStorage
  getUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },
}

export default authService