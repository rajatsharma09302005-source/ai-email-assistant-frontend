import axiosInstance from '../utils/axiosConfig'
import { API_ENDPOINTS } from '../utils/constants'

const emailService = {
  // Get all emails
  getEmails: async (type = 'inbox') => {
    const response = await axiosInstance.get(`${API_ENDPOINTS.EMAILS}?type=${type}`)
    return response.data
  },

  // Get single email
  getEmail: async (id) => {
    const response = await axiosInstance.get(API_ENDPOINTS.EMAIL_DETAIL(id))
    return response.data
  },

  // Create draft email
  createEmail: async (emailData) => {
    const response = await axiosInstance.post(API_ENDPOINTS.EMAIL_CREATE, emailData)
    return response.data
  },

  // Send email
  sendEmail: async (id) => {
    const response = await axiosInstance.post(API_ENDPOINTS.EMAIL_SEND(id))
    return response.data
  },

  // Reply to email
  replyEmail: async (id, body) => {
    const response = await axiosInstance.post(API_ENDPOINTS.EMAIL_REPLY(id), { body })
    return response.data
  },

  // Delete email
  deleteEmail: async (id) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.EMAIL_DELETE(id))
    return response.data
  },

  // Star email
  starEmail: async (id) => {
    const response = await axiosInstance.post(API_ENDPOINTS.EMAIL_STAR(id))
    return response.data
  },

  // Mark email as read
  markRead: async (id) => {
    const response = await axiosInstance.post(API_ENDPOINTS.EMAIL_MARK_READ(id))
    return response.data
  },

  // Fetch inbox from Gmail
  fetchInbox: async () => {
    const response = await axiosInstance.post(API_ENDPOINTS.FETCH_INBOX)
    return response.data
  },

  // Get email stats
  getStats: async () => {
    const response = await axiosInstance.get(API_ENDPOINTS.GMAIL_STATS)
    return response.data
  },
}

export default emailService