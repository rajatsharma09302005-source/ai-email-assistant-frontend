import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import emailService from '../services/emailService'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import axiosInstance from '../utils/axiosConfig'

const Dashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({ total: 0, unread: 0, sent: 0, starred: 0 })
  const [recentEmails, setRecentEmails] = useState([])
  const [loading, setLoading] = useState(true)
  const [gmailConnected, setGmailConnected] = useState(false)

  // ✅ Connect Gmail handler
  const handleConnectGmail = async () => {
    try {
      const response = await axiosInstance.get('/api/auth/gmail/init/')
      window.location.href = response.data.auth_url
    } catch (error) {
      console.error('Failed to initiate Gmail OAuth:', error)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch stats and emails
        const [statsData, emailsData] = await Promise.all([
          emailService.getStats(),
          emailService.getEmails('inbox'),
        ])
        setStats(statsData)
        setRecentEmails(emailsData.emails?.slice(0, 5) || [])
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }

      // ✅ Check Gmail connection status
      try {
        const response = await axiosInstance.get('/api/auth/gmail/status/')
        setGmailConnected(response.data.connected)
      } catch (error) {
        setGmailConnected(false)
      }
    }

    fetchData()
  }, [])

  const statCards = [
    { label: 'Total Emails', value: stats.total, icon: 'bi-envelope', color: 'primary' },
    { label: 'Unread', value: stats.unread, icon: 'bi-envelope-open', color: 'warning' },
    { label: 'Sent', value: stats.sent, icon: 'bi-send', color: 'success' },
    { label: 'Starred', value: stats.starred, icon: 'bi-star', color: 'danger' },
  ]

  return (
    <div>
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light">

          {/* Welcome */}
          <div className="mb-4">
            <h4 className="fw-bold">
              Welcome back, {user?.first_name || 'User'}! 👋
            </h4>
            <p className="text-muted">Here's your email overview</p>
          </div>

          {/* ✅ Gmail NOT connected - show warning */}
          {!gmailConnected && (
            <div className="alert alert-warning d-flex align-items-center justify-content-between mb-4">
              <div>
                <i className="bi bi-exclamation-triangle me-2"></i>
                <strong>Gmail not connected!</strong> Connect Gmail to read and send real emails.
              </div>
              <button className="btn btn-warning btn-sm" onClick={handleConnectGmail}>
                <i className="bi bi-google me-1"></i>Connect Gmail
              </button>
            </div>
          )}

          {/* ✅ Gmail IS connected - show success */}
          {gmailConnected && (
            <div className="alert alert-success mb-4">
              <i className="bi bi-check-circle me-2"></i>
              <strong>Gmail connected!</strong> Go to Inbox and click "Sync Gmail" to load your emails.
            </div>
          )}

          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            {statCards.map((card, i) => (
              <div key={i} className="col-md-3">
                <div className="card border-0 shadow-sm">
                  <div className="card-body d-flex align-items-center gap-3">
                    <div className={`bg-${card.color} bg-opacity-10 rounded-3 p-3`}>
                      <i className={`bi ${card.icon} text-${card.color} fs-4`}></i>
                    </div>
                    <div>
                      <h3 className="fw-bold mb-0">{loading ? '...' : card.value}</h3>
                      <small className="text-muted">{card.label}</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="row g-3 mb-4">
            <div className="col-12">
              <h5 className="fw-semibold mb-3">Quick Actions</h5>
            </div>
            {[
              { to: '/compose', icon: 'bi-pencil-square', label: 'Compose Email', color: 'primary' },
              { to: '/compose?mode=improve', icon: 'bi-magic', label: 'Improve Email', color: 'success' },
              { to: '/compose?mode=reply', icon: 'bi-reply', label: 'Generate Reply', color: 'warning' },
              { to: '/inbox', icon: 'bi-inbox', label: 'View Inbox', color: 'info' },
            ].map((action, i) => (
              <div key={i} className="col-md-3">
                <Link to={action.to} className="text-decoration-none">
                  <div className={`card border-0 shadow-sm border-start border-${action.color} border-3 h-100`}>
                    <div className="card-body d-flex align-items-center gap-3">
                      <i className={`bi ${action.icon} text-${action.color} fs-4`}></i>
                      <span className="fw-semibold text-dark">{action.label}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          {/* Recent Emails */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0">Recent Emails</h6>
              <Link to="/inbox" className="btn btn-sm btn-outline-primary">View All</Link>
            </div>
            <div className="card-body p-0">
              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner-border spinner-border-sm text-primary"></div>
                </div>
              ) : recentEmails.length === 0 ? (
                <div className="text-center p-4 text-muted">
                  <i className="bi bi-inbox fs-1 d-block mb-2"></i>
                  No emails yet. <Link to="/inbox">Sync your inbox</Link>
                </div>
              ) : (
                <div className="list-group list-group-flush">
                  {recentEmails.map((email) => (
                    <Link
                      key={email.id}
                      to={`/emails/${email.id}`}
                      className="list-group-item list-group-item-action px-4 py-3"
                    >
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1 me-3">
                          <div className="d-flex align-items-center gap-2 mb-1">
                            {!email.is_read && (
                              <span className="badge bg-primary rounded-pill" style={{ fontSize: '8px' }}>NEW</span>
                            )}
                            <span className={`small ${!email.is_read ? 'fw-bold' : ''}`}>
                              {email.sender}
                            </span>
                          </div>
                          <p className={`mb-0 small ${!email.is_read ? 'fw-semibold' : 'text-muted'}`}>
                            {email.subject}
                          </p>
                        </div>
                        <small className="text-muted text-nowrap">
                          {new Date(email.created_at).toLocaleDateString()}
                        </small>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Dashboard