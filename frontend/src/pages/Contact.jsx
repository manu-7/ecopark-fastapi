import { useState } from 'react'
import Alert from '../components/Alert'

const info = [
  {
    icon: '📍',
    label: 'Address',
    value: 'Major Arterial Road (South-East), Action Area II\nNew Town, Kolkata, West Bengal 700156',
  },
  {
    icon: '📞',
    label: 'Phone',
    value: '+91 (0)33 2706 4010\n+91 (0)33 2962 3274 (Manager)',
  },
  {
    icon: '📧',
    label: 'Email',
    value: 'curator@ecoparknewtown.com\ntourism@ecoparknewtown.com\ncurator.ecopark@wbhidco.in',
  },
  {
    icon: '🕐',
    label: 'Opening Hours',
    value: 'Tue – Sun: 12:00 PM – 8:30 PM\nMon – Fri (Morning Walk): 5:00 AM – 8:00 AM\nClosed on Mondays (regular hours)',
  },
  {
    icon: '🎫',
    label: 'Entry Fee',
    value: '₹30 per person\nChildren under 3 years — Free\nActivity rides priced separately',
  },
  {
    icon: '🗺️',
    label: 'How to Reach',
    value: 'By Metro: New Town Metro Station\nBy Bus: Routes via Sector V, Salt Lake\nBy Cab: Eco Park Gate 1 or Gate 2',
  },
]

export default function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setSuccess("Your message has been sent! We'll get back to you soon.")
      setForm({ name: '', email: '', message: '' })
      setLoading(false)
    }, 600)
  }

  return (
    <div style={{ background: 'var(--cream)', minHeight: '80vh', fontFamily: "'DM Sans', sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--forest) 0%, var(--leaf) 100%)', padding: '70px 20px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--moss)' }}>GET IN TOUCH</span>
        <h1 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.8rem)', color: '#fff', marginTop: 10, marginBottom: 12 }}>Contact Us</h1>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, maxWidth: 480, margin: '0 auto' }}>
          Eco Park (Prakriti Tirtha) · New Town, Kolkata
        </p>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 20px' }}>

        {/* Info Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 20, marginBottom: 52 }}>
          {info.map(({ icon, label, value }) => (
            <div key={label} className="card" style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: '20px 20px' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--leaf)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                {icon}
              </div>
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--sage)', marginBottom: 4 }}>{label}</div>
                <div style={{ fontSize: 13, color: 'var(--charcoal)', lineHeight: 1.65, whiteSpace: 'pre-line' }}>{value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Map + Form */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: 32, alignItems: 'start' }}>

          {/* Map */}
          <div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: 'var(--forest)', marginBottom: 16 }}>📍 Find Us on the Map</h3>
            <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.0!2d88.4726!3d22.5955!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f89e9b4e1f6ef7%3A0x7e5b8c9a3f2d1e0c!2sEco%20Park%2C%20New%20Town%2C%20Kolkata!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%" height="320" style={{ border: 0, display: 'block' }}
                allowFullScreen loading="lazy" title="Eco Park New Town Location"
              />
            </div>
            <div style={{ marginTop: 20, background: 'var(--forest)', borderRadius: 14, padding: '20px 22px' }}>
              <div style={{ color: '#95d5b2', fontWeight: 700, fontSize: 14, marginBottom: 8 }}>🚇 Nearest Metro</div>
              <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.6 }}>
                New Town Station (East-West Metro Line)<br />
                Auto/cab available from the station gate
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card animate-fadeup" style={{ padding: 32 }}>
            <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: 20, color: 'var(--forest)', marginBottom: 24 }}>Send a Message</h3>
            {success && <Alert type="success" message={success} onClose={() => setSuccess('')} />}
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: 18 }}>
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-control" value={form.name}
                  onChange={handleChange} required placeholder="Your name" />
              </div>
              <div style={{ marginBottom: 18 }}>
                <label className="form-label">Email Address</label>
                <input type="email" name="email" className="form-control" value={form.email}
                  onChange={handleChange} required placeholder="your@email.com" />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label className="form-label">Message</label>
                <textarea name="message" className="form-control" rows="5" value={form.message}
                  onChange={handleChange} required placeholder="How can we help you?" style={{ resize: 'vertical' }} />
              </div>
              <button className="btn-primary" type="submit" style={{ width: '100%', padding: '13px', fontSize: 15, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                {loading ? 'Sending…' : '→ Send Message'}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:750px){.contact-lower{grid-template-columns:1fr !important}}`}</style>
    </div>
  )
}
