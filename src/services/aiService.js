import axiosInstance from '../utils/axiosConfig'
import { API_ENDPOINTS } from '../utils/constants'

const aiService = {
  // Compose new email
  composeEmail: async (description, tone, recipientName = '') => {
    const response = await axiosInstance.post(API_ENDPOINTS.AI_COMPOSE, {
      description,
      tone,
      recipient_name: recipientName,
    })
    return response.data
  },

  // Improve existing email
  improveEmail: async (draft, tone) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AI_IMPROVE, {
      draft,
      tone,
    })
    return response.data
  },

  // Generate reply
  generateReply: async (receivedEmail, tone, additionalContext = '') => {
    const response = await axiosInstance.post(API_ENDPOINTS.AI_REPLY, {
      received_email: receivedEmail,
      tone,
      additional_context: additionalContext,
    })
    return response.data
  },

  // Generate subject lines
  generateSubject: async (emailBody, tone) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AI_SUBJECT, {
      email_body: emailBody,
      tone,
    })
    return response.data
  },

  // Summarize email
  summarizeEmail: async (emailBody) => {
    const response = await axiosInstance.post(API_ENDPOINTS.AI_SUMMARIZE, {
      email_body: emailBody,
    })
    return response.data
  },
}

export default aiService