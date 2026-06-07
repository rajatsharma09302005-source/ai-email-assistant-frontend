import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import emailService from '../services/emailService'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

const Inbox = ({ type = 'inbox' }) => {
  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchEmails()
  }, [type])

  const fetchEmails = async () => {
    try {
      setLoading(true)
      const data = await emailService.getEmails(type)
      setEmails(data.emails || [])
    } catch (error) {
      console.error('Failed to fetch emails:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSync = async () => {
    try {
      setSyncing(true)
      const data = await emailService.fetchInbox()
      setMessage(data.message)
      await fetchEmails()
    } catch (error) {
      setMessage('Failed to sync. Gmail not connected yet.')
    } finally {
      setSyncing(false)
      setTimeout(() => setMessage(''), 3000)
    }
  }

  const handleDelete = async (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    if (window.confirm('Delete this email?')) {
      await emailService.deleteEmail(id)
      setEmails(emails.filter(e => e.id !== id))
    }
  }

  const handleStar = async (id, e) => {
    e.preventDefault()
    e.stopPropagation()
    await emailService.starEmail(id)
    setEmails(emails.map(email =>
      email.id === id ? { ...email, is_starred: !email.is_starred } : email
    ))
  }

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="fw-bold mb-0">
              {type === 'sent' ? 'Sent Emails' : 'Inbox'}
              <span className="badge bg-primary ms-2 fs-6">{emails.length}</span>
            </h4>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={handleSync}
                disabled={syncing}
              >
                {syncing ? (
                  <><span className="spinner-border spinner-border-sm me-1"></span>Syncing...</>
                ) : (
                  <><i className="bi bi-arrow-clockwise me-1"></i>Sync Gmail</>
                )}
              </button>
              <Link to="/compose" className="btn btn-primary btn-sm">
                <i className="bi bi-pencil-square me-1"></i>Compose
              </Link>
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className="alert alert-info alert-dismissible mb-3">
              {message}
            </div>
          )}

          {/* Email List */}
          <div className="card border-0 shadow-sm">
            {loading ? (
              <div className="text-center p-5">
                <div className="spinner-border text-primary"></div>
                <p className="mt-2 text-muted">Loading emails...</p>
              </div>
            ) : emails.length === 0 ? (
              <div className="text-center p-5 text-muted">
                <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                <h5>No emails found</h5>
                <p>Click "Sync Gmail" to fetch your emails</p>
              </div>
            ) : (
              <div className="list-group list-group-flush">
                {emails.map((email) => (
                  <Link
                    key={email.id}
                    to={`/emails/${email.id}`}
                    className={`list-group-item list-group-item-action px-4 py-3 ${!email.is_read ? 'bg-primary bg-opacity-5' : ''}`}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-start gap-3 flex-grow-1">
                        {/* Star */}
                        <button
                          className={`btn btn-sm p-0 border-0 ${email.is_starred ? 'text-warning' : 'text-muted'}`}
                          onClick={(e) => handleStar(email.id, e)}
                        >
                          <i className={`bi ${email.is_starred ? 'bi-star-fill' : 'bi-star'}`}></i>
                        </button>

                        {/* Email info */}
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            <span className={`small ${!email.is_read ? 'fw-bold' : ''}`}>
                              {email.sender}
                            </span>
                            {!email.is_read && (
                              <span className="badge bg-primary" style={{ fontSize: '10px' }}>New</span>
                            )}
                          </div>
                          <p className={`mb-0 ${!email.is_read ? 'fw-semibold' : 'text-muted'} small`}>
                            {email.subject}
                          </p>
                        </div>
                      </div>

                      {/* Date & Delete */}
                      <div className="d-flex align-items-center gap-2">
                        <small className="text-muted text-nowrap">
                          {new Date(email.created_at).toLocaleDateString()}
                        </small>
                        <button
                          className="btn btn-sm btn-outline-danger border-0"
                          onClick={(e) => handleDelete(email.id, e)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Inbox