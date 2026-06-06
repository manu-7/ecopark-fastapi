import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--forest)',
      color: 'rgba(255,255,255,0.75)',
      padding: '48px 20px 28px',
      marginTop: 'auto',
    }}>
      <div style={{ maxWidth:1100, margin:'0 auto' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:32, marginBottom:32 }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
              <span style={{ fontSize:24 }}>🌿</span>
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:20, color:'#fff', fontWeight:700 }}>Eco Park</span>
            </div>
            <p style={{ fontSize:13, lineHeight:1.7, color:'rgba(255,255,255,0.55)' }}>
              A sanctuary where nature meets adventure. Book your visit and explore the beauty of the natural world.
            </p>
          </div>
          <div>
            <h6 style={{ fontSize:12, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--moss)', marginBottom:14 }}>Explore</h6>
            {[['/', 'Home'], ['/book_ticket', 'Book Tickets'], ['/adventure', 'Adventure'], ['/contact', 'Contact Us']].map(([path, label]) => (
              <div key={path} style={{ marginBottom:8 }}>
                <Link to={path} style={{ fontSize:14, color:'rgba(255,255,255,0.65)', transition:'color 0.2s' }}
                  onMouseEnter={e=>e.target.style.color='#95d5b2'} onMouseLeave={e=>e.target.style.color='rgba(255,255,255,0.65)'}>
                  {label}
                </Link>
              </div>
            ))}
          </div>
          <div>
            <h6 style={{ fontSize:12, fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--moss)', marginBottom:14 }}>Visit Us</h6>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', lineHeight:1.7 }}>📍 Eco Park, Kolkata, West Bengal</p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', marginTop:6 }}>🕗 Open daily: 6am – 8pm</p>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.55)', marginTop:6 }}>🎫 ₹30 per ticket</p>
          </div>
        </div>
        <div style={{ borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:20, textAlign:'center', fontSize:12, color:'rgba(255,255,255,0.35)' }}>
          © 2025 Eco Park. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
