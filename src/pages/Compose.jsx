import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import aiService from '../services/aiService'
import emailService from '../services/emailService'
import { TONE_OPTIONS } from '../utils/constants'

const Compose = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultMode = searchParams.get('mode') || 'compose'

  const [mode, setMode] = useState(defaultMode)
  const [tone, setTone] = useState('professional')
  const [loading, setLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [message, setMessage] = useState({ text: '', type: '' })

  // Compose mode
  const [description, setDescription] = useState('')
  const [recipientName, setRecipientName] = useState('')

  // Improve mode
  const [draft, setDraft] = useState('')

  // Reply mode
  const [receivedEmail, setReceivedEmail] = useState('')
  const [additionalContext, setAdditionalContext] = useState('')

  // Output
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [recipient, setRecipient] = useState('')
  const [subjects, setSubjects] = useState([])

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type })
    setTimeout(() => setMessage({ text: '', type: '' }), 4000)
  }

  const handleGenerate = async () => {
    try {
      setLoading(true)
      let result

      if (mode === 'compose') {
        if (!description.trim()) return alert('Please describe your email')
        result = await aiService.composeEmail(description, tone, recipientName)
        setSubject(result.subject)
        setBody(result.body)

      } else if (mode === 'improve') {
        if (!draft.trim()) return alert('Please paste your email draft')
        result = await aiService.improveEmail(draft, tone)
        setSubject(result.subject)
        setBody(result.body)

      } else if (mode === 'reply') {
        if (!receivedEmail.trim()) return alert('Please paste the received email')
        result = await aiService.generateReply(receivedEmail, tone, additionalContext)
        setSubject(result.subject)
        setBody(result.body)

      } else if (mode === 'subject') {
        if (!body.trim()) return alert('Please write email body first')
        result = await aiService.generateSubject(body, tone)
        setSubjects(result.subjects)
        return
      }

      showMessage('✅ Email generated successfully!')
    } catch (error) {
      showMessage('❌ Failed to generate. Check Gemini API.', 'danger')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveAndSend = async () => {
    if (!recipient.trim()) return alert('Please enter recipient email')
    if (!subject.trim()) return alert('Subject is required')
    if (!body.trim()) return alert('Email body is required')

    try {
      setSending(true)
      // Create draft
      const email = await emailService.createEmail({
        recipient,
        subject,
        body,
      })
      // Send it
      await emailService.sendEmail(email.id)
      showMessage('✅ Email sent successfully!')
      setTimeout(() => navigate('/sent'), 2000)
    } catch (error) {
      showMessage('❌ Failed to send email. Gmail not connected yet.', 'warning')
    } finally {
      setSending(false)
    }
  }

  const handleSaveDraft = async () => {
    if (!subject.trim() || !body.trim()) return alert('Subject and body required')
    try {
      await emailService.createEmail({ recipient, subject, body })
      showMessage('✅ Draft saved!')
    } catch (error) {
      showMessage('❌ Failed to save draft', 'danger')
    }
  }

  const modes = [
    { key: 'compose', icon: 'bi-pencil-square', label: 'Compose' },
    { key: 'improve', icon: 'bi-magic', label: 'Improve' },
    { key: 'reply', icon: 'bi-reply', label: 'Reply' },
    { key: 'subject', icon: 'bi-tag', label: 'Subject' },
  ]

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light">
          <h4 className="fw-bold mb-4">
            <i className="bi bi-magic text-primary me-2"></i>
            AI Email Composer
          </h4>

          {/* Mode Tabs */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body p-2">
              <div className="btn-group w-100">
                {modes.map(m => (
                  <button
                    key={m.key}
                    className={`btn ${mode === m.key ? 'btn-primary' : 'btn-outline-secondary'}`}
                    onClick={() => setMode(m.key)}
                  >
                    <i className={`bi ${m.icon} me-1`}></i>{m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="row g-4">
            {/* Input Panel */}
            <div className="col-md-5">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h6 className="fw-bold mb-0">Input</h6>
                </div>
                <div className="card-body">

                  {/* Tone Selector */}
                  <div className="mb-3">
                    <label className="form-label small fw-semibold">Tone</label>
                    <select
                      className="form-select form-select-sm"
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                    >
                      {TONE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  </div>

                  {/* Compose Mode */}
                  {mode === 'compose' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Recipient Name (optional)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. Mr. Sharma"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Describe your email *</label>
                        <textarea
                          className="form-control"
                          rows={5}
                          placeholder="e.g. Write an email to my manager requesting Friday off for a family event"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* Improve Mode */}
                  {mode === 'improve' && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Paste your draft *</label>
                      <textarea
                        className="form-control"
                        rows={8}
                        placeholder="Paste your email draft here to improve it..."
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Reply Mode */}
                  {mode === 'reply' && (
                    <>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Received Email *</label>
                        <textarea
                          className="form-control"
                          rows={5}
                          placeholder="Paste the email you received..."
                          value={receivedEmail}
                          onChange={(e) => setReceivedEmail(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small fw-semibold">Additional Context (optional)</label>
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          placeholder="e.g. I am available Thursday afternoon"
                          value={additionalContext}
                          onChange={(e) => setAdditionalContext(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {/* Subject Mode */}
                  {mode === 'subject' && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Email Body *</label>
                      <textarea
                        className="form-control"
                        rows={8}
                        placeholder="Paste your email body to generate subject lines..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Generate Button */}
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleGenerate}
                    disabled={loading}
                  >
                    {loading ? (
                      <><span className="spinner-border spinner-border-sm me-1"></span>Generating...</>
                    ) : (
                      <><i className="bi bi-magic me-1"></i>Generate with AI</>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Output Panel */}
            <div className="col-md-7">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-header bg-white border-0">
                  <h6 className="fw-bold mb-0">Output</h6>
                </div>
                <div className="card-body">

                  {/* Message */}
                  {message.text && (
                    <div className={`alert alert-${message.type} mb-3`}>
                      {message.text}
                    </div>
                  )}

                  {/* Subject suggestions */}
                  {mode === 'subject' && subjects.length > 0 && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Subject Suggestions</label>
                      {subjects.map((s, i) => (
                        <div
                          key={i}
                          className="p-2 mb-2 border rounded cursor-pointer hover-bg"
                          onClick={() => setSubject(s)}
                          style={{ cursor: 'pointer' }}
                        >
                          <span className="badge bg-primary me-2">{i + 1}</span>
                          {s}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Recipient */}
                  {mode !== 'subject' && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">To *</label>
                      <input
                        type="email"
                        className="form-control form-control-sm"
                        placeholder="recipient@email.com"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Subject */}
                  {mode !== 'subject' && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Subject</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        placeholder="Email subject..."
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Body */}
                  {mode !== 'subject' && (
                    <div className="mb-3">
                      <label className="form-label small fw-semibold">Body</label>
                      <textarea
                        className="form-control"
                        rows={10}
                        placeholder="AI generated email will appear here..."
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                      />
                    </div>
                  )}

                  {/* Action Buttons */}
                  {mode !== 'subject' && (
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-success flex-grow-1"
                        onClick={handleSaveAndSend}
                        disabled={sending}
                      >
                        {sending ? (
                          <><span className="spinner-border spinner-border-sm me-1"></span>Sending...</>
                        ) : (
                          <><i className="bi bi-send me-1"></i>Send Email</>
                        )}
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={handleSaveDraft}
                      >
                        <i className="bi bi-save me-1"></i>Save Draft
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => navigator.clipboard.writeText(body)}
                      >
                        <i className="bi bi-clipboard"></i>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Compose