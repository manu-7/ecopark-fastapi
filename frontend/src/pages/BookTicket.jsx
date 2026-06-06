import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'
import Alert from '../components/Alert'

export default function BookTicket() {
  const { isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()
  const today = new Date().toISOString().split('T')[0]

  const [form, setForm] = useState({ name: '', email: '', date: today, tickets: 1 })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')
    if (parseInt(form.tickets) < 1) {
      setError('Please select at least 1 ticket.')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/tickets/book_ticket', { ...form, tickets: parseInt(form.tickets) })
      setSuccess('Ticket booked! Redirecting to payment…')
      setTimeout(() => navigate(`/process_payment/${res.data.id}`), 900)
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const total = parseInt(form.tickets || 0) * 30

  return (
    <div style={{ background: 'var(--cream)', minHeight: '80vh', padding: '60px 20px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }} className="animate-fadeup">
          <span style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--sage)' }}>ONLINE BOOKING</span>
          <h2 style={{ fontFamily: "'Playfair Display',serif", fontSize: 'clamp(1.8rem,4vw,2.4rem)', color: 'var(--forest)', marginTop: 8, marginBottom: 8 }}>Book Your Tickets</h2>
          <p style={{ color: 'var(--muted)', fontSize: 14 }}>Fill in the details to reserve your spot at Eco Park.</p>
        </div>

        {isAuthenticated ? (
          <div className="card animate-fadeup" style={{ padding: 36, animationDelay: '0.1s' }}>
            {error && <Alert type="danger" message={error} onClose={() => setError('')} />}
            {success && <Alert type="success" message={success} />}

            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Full Name</label>
                  <input type="text" name="name" className="form-control" value={form.name}
                    onChange={handleChange} required placeholder="Your full name" />
                </div>
                <div style={{ gridColumn: '1/-1' }}>
                  <label className="form-label">Email Address</label>
                  <input type="email" name="email" className="form-control" value={form.email}
                    onChange={handleChange} required placeholder="your@email.com" />
                </div>
                <div>
                  <label className="form-label">Visit Date</label>
                  <input type="date" name="date" className="form-control" value={form.date}
                    onChange={handleChange} required min={today} />
                  <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 5 }}>Select today or a future date</p>
                </div>
                <div>
                  <label className="form-label">No. of Tickets</label>
                  <input type="number" name="tickets" className="form-control" value={form.tickets}
                    onChange={handleChange} min="1" max="20" required />
                </div>
              </div>

              {/* Price summary */}
              <div style={{ background: 'var(--cream)', border: '1px solid var(--sand)', borderRadius: 12, padding: '16px 20px', marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Amount</div>
                  <div style={{ fontSize: 22, fontFamily: "'Playfair Display',serif", color: 'var(--forest)', fontWeight: 700 }}>₹{total}</div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--muted)', textAlign: 'right' }}>
                  {form.tickets} ticket{form.tickets > 1 ? 's' : ''}<br />
                  <span style={{ fontSize: 11 }}>@ ₹30 each</span>
                </div>
              </div>

              <button className="btn-primary" type="submit" style={{ width: '100%', padding: '14px', fontSize: 15, opacity: loading ? 0.7 : 1 }} disabled={loading}>
                {loading ? 'Processing…' : '🎫 Confirm Booking'}
              </button>
            </form>
          </div>
        ) : (
          <div className="card animate-fadeup" style={{ padding: 40, textAlign: 'center', animationDelay: '0.1s' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <h3 style={{ fontFamily: "'Playfair Display',serif", color: 'var(--forest)', marginBottom: 10 }}>Login Required</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
              You need to be logged in to book tickets. Create an account or sign in to continue.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <Link to="/login" className="btn-primary">Sign In</Link>
              <Link to="/register" className="btn-outline">Register</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
