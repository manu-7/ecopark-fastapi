import { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

// FIX: removed console.log of sensitive token data
export default function GoogleSuccess() {
  const navigate = useNavigate()
  const { setToken } = useContext(AuthContext)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const token = params.get('token')
    const username = params.get('username')

    if (token && username) {
      setToken(token, username)
      navigate('/', { replace: true })
    } else {
      // FIX: redirect to login if no token received
      navigate('/login', { replace: true })
    }
  }, [])

  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      background: 'var(--cream)',
    }}>
      <div className="spinner" />
      <p style={{ color: 'var(--forest)', fontFamily: "'Playfair Display', serif", fontSize: 18 }}>
        Signing you in with Google...
      </p>
    </div>
  )
}
