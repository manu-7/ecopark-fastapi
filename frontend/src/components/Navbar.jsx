import { useContext, useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'

export default function Navbar() {
  const { isAuthenticated, username, isAdmin, setToken } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setOpen(false) }, [location.pathname])

  const handleLogout = async () => {
    await api.post('/auth/logout').catch(() => {})
    setToken(null)
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  const navStyle = {
    position: 'sticky', top: 0, zIndex: 1000,
    background: scrolled ? 'rgba(26,61,43,0.97)' : 'rgba(26,61,43,0.92)',
    backdropFilter: 'blur(12px)',
    borderBottom: scrolled ? '1px solid rgba(82,183,136,0.2)' : 'none',
    transition: 'all 0.3s ease',
  }

  const linkStyle = (path) => ({
    fontFamily: "'DM Sans', sans-serif",
    fontSize: 14, fontWeight: 500,
    color: isActive(path) ? '#95d5b2' : 'rgba(255,255,255,0.82)',
    padding: '6px 14px', borderRadius: 8,
    background: isActive(path) ? 'rgba(82,183,136,0.15)' : 'transparent',
    transition: 'all 0.25s',
    display: 'inline-block',
  })

  return (
    <nav style={navStyle}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 20px', display:'flex', alignItems:'center', justifyContent:'space-between', height:64 }}>
        {/* Logo */}
        <Link to="/" style={{ display:'flex', alignItems:'center', gap:10, textDecoration:'none' }}>
          <span style={{ fontSize:28 }}>🌿</span>
          <span style={{ fontFamily:"'Playfair Display', serif", fontSize:22, fontWeight:700, color:'#fff', letterSpacing:'-0.02em' }}>
            Eco Park
          </span>
        </Link>

        {/* Desktop Nav */}
        <div style={{ display:'flex', alignItems:'center', gap:4 }} className="desktop-nav">
          <Link to="/" style={linkStyle('/')} onMouseEnter={e=>e.target.style.color='#95d5b2'} onMouseLeave={e=>e.target.style.color=isActive('/')?'#95d5b2':'rgba(255,255,255,0.82)'}>Home</Link>
          <Link to="/book_ticket" style={linkStyle('/book_ticket')} onMouseEnter={e=>e.target.style.color='#95d5b2'} onMouseLeave={e=>e.target.style.color=isActive('/book_ticket')?'#95d5b2':'rgba(255,255,255,0.82)'}>Book Ticket</Link>
          <Link to="/adventure" style={linkStyle('/adventure')} onMouseEnter={e=>e.target.style.color='#95d5b2'} onMouseLeave={e=>e.target.style.color=isActive('/adventure')?'#95d5b2':'rgba(255,255,255,0.82)'}>Adventure</Link>
          <Link to="/contact" style={linkStyle('/contact')} onMouseEnter={e=>e.target.style.color='#95d5b2'} onMouseLeave={e=>e.target.style.color=isActive('/contact')?'#95d5b2':'rgba(255,255,255,0.82)'}>Contact</Link>
          {isAuthenticated && (
            <Link to="/my-bookings" style={linkStyle('/my-bookings')} onMouseEnter={e=>e.target.style.color='#95d5b2'} onMouseLeave={e=>e.target.style.color=isActive('/my-bookings')?'#95d5b2':'rgba(255,255,255,0.82)'}>My Bookings</Link>
          )}
          {isAdmin && (
            <Link to="/admin" style={{...linkStyle('/admin'), background: isActive('/admin') ? 'rgba(255,170,0,0.2)' : 'rgba(255,170,0,0.08)', color: isActive('/admin') ? '#ffd166' : '#ffc947'}} onMouseEnter={e=>e.target.style.color='#ffd166'} onMouseLeave={e=>e.target.style.color=isActive('/admin')?'#ffd166':'#ffc947'}>⚙ Admin</Link>
          )}

          <span style={{ width:1, height:24, background:'rgba(255,255,255,0.15)', margin:'0 8px', display:'inline-block' }} />

          {isAuthenticated ? (
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <span style={{ color:'rgba(255,255,255,0.65)', fontSize:13 }}>👤 {username}</span>
              <button className="btn-danger" style={{ padding:'7px 16px', fontSize:13 }} onClick={handleLogout}>Logout</button>
            </div>
          ) : (
            <div style={{ display:'flex', gap:8 }}>
              <Link to="/register" className="btn-outline" style={{ color:'rgba(255,255,255,0.85)', borderColor:'rgba(255,255,255,0.4)', padding:'7px 18px', fontSize:13 }}>Register</Link>
              <Link to="/login" className="btn-primary" style={{ padding:'7px 18px', fontSize:13 }}>Login</Link>
            </div>
          )}
        </div>

        {/* Hamburger */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{ display:'none', background:'none', border:'none', cursor:'pointer', padding:6 }}
          className="hamburger"
          aria-label="Toggle menu"
        >
          <div style={{ width:22, height:2, background:'#fff', margin:'4px 0', transition:'all 0.3s', transform: open ? 'rotate(45deg) translate(4px,4px)' : 'none' }} />
          <div style={{ width:22, height:2, background:'#fff', margin:'4px 0', transition:'all 0.3s', opacity: open ? 0 : 1 }} />
          <div style={{ width:22, height:2, background:'#fff', margin:'4px 0', transition:'all 0.3s', transform: open ? 'rotate(-45deg) translate(4px,-4px)' : 'none' }} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div style={{ background:'rgba(22,52,36,0.98)', padding:'12px 20px 20px', borderTop:'1px solid rgba(82,183,136,0.2)' }}>
          {[['/', 'Home'], ['/book_ticket','Book Ticket'], ['/adventure','Adventure'], ['/contact','Contact']].map(([path, label]) => (
            <Link key={path} to={path} style={{ display:'block', color: isActive(path)?'#95d5b2':'rgba(255,255,255,0.8)', padding:'10px 0', fontSize:15, fontWeight:500, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>{label}</Link>
          ))}
          {isAuthenticated && (
            <Link to="/my-bookings" style={{ display:'block', color: isActive('/my-bookings')?'#95d5b2':'rgba(255,255,255,0.8)', padding:'10px 0', fontSize:15, fontWeight:500, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>My Bookings</Link>
          )}
          {isAdmin && (
            <Link to="/admin" style={{ display:'block', color: isActive('/admin')?'#ffd166':'#ffc947', padding:'10px 0', fontSize:15, fontWeight:500, borderBottom:'1px solid rgba(255,255,255,0.07)' }}>⚙ Admin</Link>
          )}
          <div style={{ marginTop:14, display:'flex', gap:8 }}>
            {isAuthenticated ? (
              <button className="btn-danger" style={{ width:'100%' }} onClick={handleLogout}>Logout</button>
            ) : (
              <>
                <Link to="/register" className="btn-outline" style={{ flex:1, textAlign:'center', color:'#fff', borderColor:'rgba(255,255,255,0.4)' }}>Register</Link>
                <Link to="/login" className="btn-primary" style={{ flex:1, textAlign:'center' }}>Login</Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger   { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
