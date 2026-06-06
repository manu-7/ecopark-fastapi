import { useContext, useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'

const STATUS_STYLE = {
  SUCCESS: { bg: 'rgba(52,211,153,0.12)', color: '#34d399', label: 'Paid' },
  PENDING: { bg: 'rgba(251,191,36,0.12)', color: '#fbbf24', label: 'Pending' },
  FAILED:  { bg: 'rgba(239,68,68,0.12)',  color: '#ef4444', label: 'Failed'  },
}

export default function MyBookings() {
  const { isAuthenticated, token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState('')
  const [cancelling, setCancelling] = useState(null)
  const [toast, setToast]     = useState('')

  useEffect(() => {
    if (!isAuthenticated) navigate('/login')
  }, [isAuthenticated])

  useEffect(() => {
    api.get('/tickets/my_bookings')
      .then(r => setBookings(r.data))
      .catch(() => setError('Failed to load bookings.'))
      .finally(() => setLoading(false))
  }, [])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const handleCancel = async (id) => {
    setCancelling(id)
    try {
      await api.delete(`/tickets/${id}`)
      setBookings(b => b.filter(x => x.id !== id))
      showToast('Booking cancelled successfully.')
    } catch (e) {
      showToast(e.response?.data?.detail || 'Cancel failed.')
    }
    setCancelling(null)
  }

  const handleDownload = async (id) => {
    try {
      const res = await api.get(`/tickets/download_ticket/${id}`, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `ecopark_ticket_${id}.pdf`
      a.click()
    } catch {
      showToast('Download failed.')
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f1f17', padding: '40px 20px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
          <div>
            <h1 style={{ color: '#e8f5e9', fontSize: 24, fontWeight: 700, margin: 0 }}>🎫 My Bookings</h1>
            <p style={{ color: 'rgba(232,245,233,0.5)', fontSize: 14, margin: '6px 0 0' }}>All your Eco Park ticket bookings</p>
          </div>
          <Link to="/book_ticket" style={{ background: '#52b788', color: '#fff', padding: '10px 20px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}>
            + New Booking
          </Link>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', marginBottom: 20 }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: 60, color: 'rgba(232,245,233,0.4)', fontSize: 15 }}>Loading your bookings…</div>
        )}

        {/* Empty */}
        {!loading && bookings.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: 60 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🌿</div>
            <p style={{ color: 'rgba(232,245,233,0.5)', fontSize: 16 }}>No bookings yet.</p>
            <Link to="/book_ticket" style={{ color: '#52b788', fontWeight: 600, fontSize: 14 }}>Book your first ticket →</Link>
          </div>
        )}

        {/* Bookings list */}
        {!loading && bookings.map(b => {
          const s = STATUS_STYLE[b.payment_status] || STATUS_STYLE.PENDING
          return (
            <div key={b.id} style={{ background: '#162b1f', border: '1px solid #1e3829', borderRadius: 14, padding: '20px 24px', marginBottom: 16, display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>

              {/* Info */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ color: 'rgba(232,245,233,0.4)', fontSize: 12 }}>#{b.id}</span>
                  <span style={{ background: s.bg, color: s.color, padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{s.label}</span>
                </div>
                <div style={{ color: '#e8f5e9', fontWeight: 600, fontSize: 16, marginBottom: 4 }}>{b.name}</div>
                <div style={{ color: 'rgba(232,245,233,0.5)', fontSize: 13 }}>{b.email}</div>
              </div>

              {/* Details */}
              <div style={{ display: 'flex', gap: 32, flexWrap: 'wrap' }}>
                {[
                  { label: 'Visit Date', value: b.date },
                  { label: 'Tickets', value: b.tickets },
                  { label: 'Amount', value: `₹${b.amount}` },
                  { label: 'Booked', value: b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—' },
                ].map(d => (
                  <div key={d.label}>
                    <div style={{ color: 'rgba(232,245,233,0.4)', fontSize: 11, marginBottom: 2 }}>{d.label}</div>
                    <div style={{ color: '#95d5b2', fontWeight: 600, fontSize: 14 }}>{d.value}</div>
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                {b.payment_status === 'SUCCESS' && (
                  <button
                    onClick={() => handleDownload(b.id)}
                    style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(82,183,136,0.15)', color: '#52b788', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                  >
                    ⬇ PDF
                  </button>
                )}
                {b.payment_status === 'PENDING' && (
                  <Link
                    to={`/process_payment/${b.id}`}
                    style={{ padding: '8px 16px', borderRadius: 8, background: '#52b788', color: '#fff', textDecoration: 'none', fontSize: 13, fontWeight: 600 }}
                  >
                    Pay Now
                  </Link>
                )}
                {b.payment_status !== 'SUCCESS' && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    disabled={cancelling === b.id}
                    style={{ padding: '8px 16px', borderRadius: 8, border: 'none', background: 'rgba(239,68,68,0.12)', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600, opacity: cancelling === b.id ? 0.6 : 1 }}
                  >
                    {cancelling === b.id ? '…' : 'Cancel'}
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1a3a28', border: '1px solid #52b788', color: '#95d5b2', padding: '12px 20px', borderRadius: 10, fontSize: 14, fontWeight: 500, zIndex: 9999 }}>
          {toast}
        </div>
      )}
    </div>
  )
}
