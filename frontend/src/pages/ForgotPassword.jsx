import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/forgot-password', { email })
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const cardStyle = {
    minHeight: '100vh', background: '#0f1f17',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: "'DM Sans', sans-serif", padding: 20,
  }

  const boxStyle = {
    background: '#162b1f', border: '1px solid #1e3829',
    borderRadius: 18, padding: '40px 36px', width: '100%', maxWidth: 420,
  }

  return (
    <div style={cardStyle}>
      <div style={boxStyle}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 36 }}>🔑</span>
          <h2 style={{ color: '#e8f5e9', fontSize: 22, fontWeight: 700, margin: '10px 0 4px' }}>Forgot Password</h2>
          <p style={{ color: 'rgba(232,245,233,0.5)', fontSize: 14, margin: 0 }}>Enter your email to receive a reset link</p>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 10, padding: '16px 20px', color: '#34d399', fontSize: 14, marginBottom: 24 }}>
              ✅ Reset link sent! Check your inbox.
            </div>
            <Link to="/login" style={{ color: '#52b788', fontWeight: 600, fontSize: 14 }}>← Back to Login</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: 20 }}>
              <label style={{ color: 'rgba(232,245,233,0.7)', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 9, border: '1px solid #1e3829', background: '#0f1f17', color: '#e8f5e9', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#52b788', color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Sending…' : 'Send Reset Link'}
            </button>
            <div style={{ textAlign: 'center', marginTop: 18 }}>
              <Link to="/login" style={{ color: 'rgba(232,245,233,0.5)', fontSize: 13 }}>← Back to Login</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
