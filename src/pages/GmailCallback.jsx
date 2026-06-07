import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../utils/axiosConfig'

const GmailCallback = () => {
  const navigate = useNavigate()
  const [status, setStatus] = useState('Connecting Gmail...')

  useEffect(() => {
    const handleCallback = async () => {
      // Get code from URL
      const params = new URLSearchParams(window.location.search)
      const code = params.get('code')

      if (!code) {
        setStatus('Error: No authorization code found')
        setTimeout(() => navigate('/dashboard'), 2000)
        return
      }

      try {
        await axiosInstance.post('/api/auth/gmail/callback/', { code })
        setStatus('✅ Gmail connected successfully!')
        setTimeout(() => navigate('/dashboard'), 2000)
      } catch (error) {
        setStatus('❌ Failed to connect Gmail. Please try again.')
        setTimeout(() => navigate('/dashboard'), 3000)
      }
    }

    handleCallback()
  }, [])

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status"></div>
        <h5>{status}</h5>
        <p className="text-muted">Redirecting to dashboard...</p>
      </div>
    </div>
  )
}

export default GmailCallback