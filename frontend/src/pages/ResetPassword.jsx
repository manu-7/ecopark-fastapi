import { useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  const [password, setPassword]   = useState('')
  const [password2, setPassword2] = useState('')
  const [loading, setLoading]     = useState(false)
  const [error, setError]         = useState('')
  const [done, setDone]           = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (password !== password2) { setError('Passwords do not match.'); return }
    if (password.length < 6)    { setError('Password must be at least 6 characters.'); return }
    setLoading(true)
    setError('')
    try {
      await api.post('/auth/reset-password', { token, new_password: password })
      setDone(true)
      setTimeout(() => navigate('/login'), 2500)
    } catch (e) {
      setError(e.response?.data?.detail || 'Invalid or expired link.')
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

  const inputStyle = {
    width: '100%', padding: '11px 14px', borderRadius: 9,
    border: '1px solid #1e3829', background: '#0f1f17',
    color: '#e8f5e9', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  }

  if (!token) return (
    <div style={cardStyle}>
      <div style={boxStyle}>
        <p style={{ color: '#ef4444', textAlign: 'center' }}>Invalid reset link.</p>
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Link to="/forgot-password" style={{ color: '#52b788' }}>Request a new one →</Link>
        </div>
      </div>
    </div>
  )

  return (
    <div style={cardStyle}>
      <div style={boxStyle}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <span style={{ fontSize: 36 }}>🔐</span>
          <h2 style={{ color: '#e8f5e9', fontSize: 22, fontWeight: 700, margin: '10px 0 4px' }}>Reset Password</h2>
          <p style={{ color: 'rgba(232,245,233,0.5)', fontSize: 14, margin: 0 }}>Enter your new password below</p>
        </div>

        {done ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: 10, padding: '16px 20px', color: '#34d399', fontSize: 14 }}>
              ✅ Password reset! Redirecting to login…
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', color: '#ef4444', fontSize: 13, marginBottom: 16 }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label style={{ color: 'rgba(232,245,233,0.7)', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>New Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min. 6 characters" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ color: 'rgba(232,245,233,0.7)', fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Confirm Password</label>
              <input type="password" value={password2} onChange={e => setPassword2(e.target.value)} required placeholder="Repeat password" style={inputStyle} />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: '#52b788', color: '#fff', fontWeight: 700, fontSize: 15, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Resetting…' : 'Reset Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
