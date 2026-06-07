import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import emailService from '../services/emailService'
import aiService from '../services/aiService'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { TONE_OPTIONS } from '../utils/constants'

const EmailDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [email, setEmail] = useState(null)
  const [loading, setLoading] = useState(true)
  const [aiReply, setAiReply] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [tone, setTone] = useState('professional')
  const [replyBody, setReplyBody] = useState('')
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchEmail()
  }, [id])

  const fetchEmail = async () => {
    try {
      const data = await emailService.getEmail(id)
      setEmail(data)
    } catch (error) {
      console.error('Failed to fetch email:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerateReply = async () => {
    try {
      setAiLoading(true)
      const data = await aiService.generateReply(email.body, tone)
      setAiReply(data.body)
      setReplyBody(data.body)
    } catch (error) {
      alert('Failed to generate reply. Check Gemini API.')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSendReply = async () => {
    if (!replyBody.trim()) {
      alert('Please write a reply first')
      return
    }
    try {
      setSending(true)
      await emailService.replyEmail(id, replyBody)
      setMessage('Reply sent successfully!')
      setReplyBody('')
      setAiReply('')
    } catch (error) {
      setMessage('Failed to send reply. Gmail not connected yet.')
    } finally {
      setSending(false)
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Delete this email?')) {
      await emailService.deleteEmail(id)
      navigate('/inbox')
    }
  }

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="spinner-border text-primary"></div>
        </div>
      </div>
    )
  }

  if (!email) {
    return (
      <div>
        <Navbar />
        <div className="text-center p-5">
          <h5>Email not found</h5>
          <button className="btn btn-primary mt-3" onClick={() => navigate('/inbox')}>
            Back to Inbox
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light">

          {/* Back button */}
          <button className="btn btn-outline-secondary btn-sm mb-3" onClick={() => navigate(-1)}>
            <i className="bi bi-arrow-left me-1"></i>Back
          </button>

          {/* Email Card */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 p-4">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="fw-bold mb-1">{email.subject}</h5>
                  <div className="text-muted small">
                    <span className="me-3"><i className="bi bi-person me-1"></i>{email.sender}</span>
                    <span><i className="bi bi-calendar me-1"></i>
                      {new Date(email.created_at).toLocaleString()}
                    </span>
                  </div>
                </div>
                <button className="btn btn-outline-danger btn-sm" onClick={handleDelete}>
                  <i className="bi bi-trash me-1"></i>Delete
                </button>
              </div>
            </div>
            <div className="card-body p-4">
              <pre className="mb-0" style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                {email.body}
              </pre>
            </div>
          </div>

          {/* AI Reply Section */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 p-4">
              <h6 className="fw-bold mb-0">
                <i className="bi bi-magic text-primary me-2"></i>
                AI-Powered Reply
              </h6>
            </div>
            <div className="card-body p-4">

              {/* Tone Selector */}
              <div className="mb-3">
                <label className="form-label small fw-semibold">Reply Tone</label>
                <select
                  className="form-select form-select-sm w-auto"
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                >
                  {TONE_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Generate Button */}
              <button
                className="btn btn-primary btn-sm mb-3"
                onClick={handleGenerateReply}
                disabled={aiLoading}
              >
                {aiLoading ? (
                  <><span className="spinner-border spinner-border-sm me-1"></span>Generating...</>
                ) : (
                  <><i className="bi bi-magic me-1"></i>Generate AI Reply</>
                )}
              </button>

              {/* Reply Editor */}
              <textarea
                className="form-control mb-3"
                rows={8}
                placeholder="AI reply will appear here, or write your own..."
                value={replyBody}
                onChange={(e) => setReplyBody(e.target.value)}
              />

              {/* Message */}
              {message && (
                <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-warning'} mb-3`}>
                  {message}
                </div>
              )}

              {/* Send Button */}
              <button
                className="btn btn-success"
                onClick={handleSendReply}
                disabled={sending || !replyBody.trim()}
              >
                {sending ? (
                  <><span className="spinner-border spinner-border-sm me-1"></span>Sending...</>
                ) : (
                  <><i className="bi bi-send me-1"></i>Send Reply</>
                )}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default EmailDetail