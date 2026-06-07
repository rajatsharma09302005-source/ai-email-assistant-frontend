export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const API_ENDPOINTS = {
  // Auth
  GOOGLE_AUTH: '/api/auth/google/',
  USER_DETAIL: '/api/auth/user/',
  LOGOUT: '/api/auth/logout/',
  TOKEN_REFRESH: '/api/auth/token/refresh/',

  // Emails
  EMAILS: '/api/emails/',
  EMAIL_CREATE: '/api/emails/create/',
  EMAIL_DETAIL: (id) => `/api/emails/${id}/`,
  EMAIL_SEND: (id) => `/api/emails/${id}/send/`,
  EMAIL_REPLY: (id) => `/api/emails/${id}/reply/`,
  EMAIL_DELETE: (id) => `/api/emails/${id}/delete/`,
  EMAIL_STAR: (id) => `/api/emails/${id}/star/`,
  EMAIL_MARK_READ: (id) => `/api/emails/${id}/mark-read/`,

  // Gmail
  FETCH_INBOX: '/api/gmail/fetch-inbox/',
  FETCH_SENT: '/api/gmail/fetch-sent/',
  GMAIL_STATS: '/api/gmail/stats/',

  // AI
  AI_COMPOSE: '/api/ai/compose/',
  AI_IMPROVE: '/api/ai/improve/',
  AI_REPLY: '/api/ai/reply/',
  AI_SUBJECT: '/api/ai/subject/',
  AI_SUMMARIZE: '/api/ai/summarize/',
}

export const TONE_OPTIONS = [
  { value: 'professional', label: 'Professional' },
  { value: 'formal', label: 'Formal' },
  { value: 'friendly', label: 'Friendly' },
  { value: 'concise', label: 'Concise' },
  { value: 'assertive', label: 'Assertive' },
]