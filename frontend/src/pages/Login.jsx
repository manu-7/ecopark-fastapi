import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'
import Alert from '../components/Alert'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setToken } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      const res = await api.post('/auth/login', formData)
      setToken(res.data.access_token, res.data.username, res.data.is_admin)
      navigate('/')
    } catch {
      setError('Invalid credentials, please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px', background:'var(--cream)' }}>
      <div style={{ position:'fixed', top:0, right:0, width:'45vw', height:'100vh', background:'linear-gradient(160deg,rgba(45,106,79,0.06),rgba(149,213,178,0.08))', pointerEvents:'none', zIndex:0 }} />

      <div style={{ width:'100%', maxWidth:440, position:'relative', zIndex:1 }} className="animate-fadeup">
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:56, height:56, borderRadius:'50%', background:'var(--leaf)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:24 }}>🌿</div>
          <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:28, color:'var(--forest)' }}>Welcome Back</h2>
          <p style={{ color:'var(--muted)', marginTop:6, fontSize:14 }}>Sign in to your Eco Park account</p>
        </div>

        <div className="card" style={{ padding:32 }}>
          {error && <Alert type="danger" message={error} onClose={() => setError('')} />}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:20 }}>
              <label className="form-label">Username</label>
              <input type="text" className="form-control" value={username} onChange={(e) => setUsername(e.target.value)} required placeholder="Enter your username" />
            </div>
            <div style={{ marginBottom:8 }}>
              <label className="form-label">Password</label>
              <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Enter your password" />
            </div>
            <div style={{ textAlign:'right', marginBottom:20 }}>
              <a href="/forgot-password" style={{ color:'#52b788', fontSize:13, textDecoration:'none' }}>Forgot password?</a>
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width:'100%', padding:'13px', fontSize:15, opacity: loading ? 0.7 : 1 }}>
              {loading ? 'Signing in...' : '→ Sign In'}
            </button>
          </form>

          <div style={{ marginTop:'24px', display:'flex', flexDirection:'column', alignItems:'center', gap:'12px' }}>
            <p style={{ fontSize:'13px', color:'var(--muted)' }}>Or continue with Google</p>
            <a
              href={`${import.meta.env.VITE_API_URL}/api/auth/google/login`}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 24px', borderRadius:8, border:'1px solid #dadce0', background:'#fff', color:'#3c4043', fontWeight:500, fontSize:14, textDecoration:'none', cursor:'pointer' }}
            >
              <img src="https://www.google.com/favicon.ico" width={18} height={18} alt="Google" />
              Sign in with Google
            </a>
          </div>

          <div style={{ textAlign:'center', marginTop:20, paddingTop:20, borderTop:'1px solid var(--sand)' }}>
            <span style={{ fontSize:13, color:'var(--muted)' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ color:'var(--leaf)', fontWeight:600 }}>Register here</Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}