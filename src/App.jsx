import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Inbox from './pages/Inbox'
import EmailDetail from './pages/EmailDetail'
import Compose from './pages/Compose'
import GmailCallback from './pages/GmailCallback'

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public route */}
            <Route path="/" element={<Login />} />

            {/* Protected routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="/inbox" element={
              <ProtectedRoute><Inbox type="inbox" /></ProtectedRoute>
            } />
            <Route path="/sent" element={
              <ProtectedRoute><Inbox type="sent" /></ProtectedRoute>
            } />
            <Route path="/emails/:id" element={
              <ProtectedRoute><EmailDetail /></ProtectedRoute>
            } />
            <Route path="/compose" element={
              <ProtectedRoute><Compose /></ProtectedRoute>
            } />

            <Route path="/gmail/callback" element={
              <ProtectedRoute><GmailCallback /></ProtectedRoute>
            } />

            {/* Catch all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App