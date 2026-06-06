import { useContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import api from '../api/axios'

const COLORS = {
  bg: '#0f1f17',
  card: '#162b1f',
  border: '#1e3829',
  green: '#52b788',
  greenLight: '#95d5b2',
  yellow: '#ffd166',
  red: '#ef4444',
  text: '#e8f5e9',
  muted: 'rgba(232,245,233,0.55)',
}

const statCardStyle = {
  background: COLORS.card,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 14,
  padding: '22px 24px',
  minWidth: 160,
  flex: 1,
}

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: 13,
}

const thStyle = {
  background: '#1a2e22',
  color: COLORS.greenLight,
  padding: '10px 14px',
  textAlign: 'left',
  fontWeight: 600,
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
}

const tdStyle = {
  padding: '11px 14px',
  borderBottom: `1px solid ${COLORS.border}`,
  color: COLORS.text,
  verticalAlign: 'middle',
}

function StatusBadge({ status }) {
  const colors = {
    SUCCESS: { bg: 'rgba(52,211,153,0.15)', color: '#34d399' },
    PENDING: { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
    FAILED:  { bg: 'rgba(239,68,68,0.15)',  color: '#ef4444' },
  }
  const style = colors[status] || { bg: 'rgba(148,163,184,0.15)', color: '#94a3b8' }
  return (
    <span style={{ background: style.bg, color: style.color, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>
      {status}
    </span>
  )
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
      <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 32, maxWidth: 380, width: '90%' }}>
        <p style={{ color: COLORS.text, marginBottom: 24, fontSize: 15 }}>{message}</p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ padding: '8px 20px', borderRadius: 8, border: `1px solid ${COLORS.border}`, background: 'transparent', color: COLORS.muted, cursor: 'pointer' }}>Cancel</button>
          <button onClick={onConfirm} style={{ padding: '8px 20px', borderRadius: 8, border: 'none', background: COLORS.red, color: '#fff', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const { isAuthenticated, isAdmin } = useContext(AuthContext)
  const navigate = useNavigate()
  const [tab, setTab] = useState('stats')
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [confirm, setConfirm] = useState(null) // { type, id, label }
  const [toast, setToast] = useState('')

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) navigate('/')
  }, [isAuthenticated, isAdmin])

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  const fetchStats = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/stats')
      setStats(res.data)
    } catch { setError('Failed to load stats') }
    setLoading(false)
  }, [])

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const params = statusFilter ? { status: statusFilter } : {}
      const res = await api.get('/admin/bookings', { params })
      setBookings(res.data.bookings)
    } catch { setError('Failed to load bookings') }
    setLoading(false)
  }, [statusFilter])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await api.get('/admin/users')
      setUsers(res.data.users)
    } catch { setError('Failed to load users') }
    setLoading(false)
  }, [])

  useEffect(() => {
    setError('')
    if (tab === 'stats')    fetchStats()
    if (tab === 'bookings') fetchBookings()
    if (tab === 'users')    fetchUsers()
  }, [tab, fetchStats, fetchBookings, fetchUsers])

  const deleteBooking = async (id) => {
    try {
      await api.delete(`/admin/bookings/${id}`)
      setBookings(b => b.filter(x => x.id !== id))
      showToast(`Booking #${id} deleted`)
    } catch { setError('Delete failed') }
  }

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/users/${id}`)
      setUsers(u => u.filter(x => x.id !== id))
      showToast(`User #${id} deleted`)
    } catch { setError('Delete failed') }
  }

  const toggleAdmin = async (id, username) => {
    try {
      const res = await api.patch(`/admin/users/${id}/toggle-admin`)
      setUsers(u => u.map(x => x.id === id ? { ...x, is_admin: res.data.is_admin } : x))
      showToast(`${username} admin status updated`)
    } catch { setError('Update failed') }
  }

  const tabs = [
    { key: 'stats',    label: '📊 Stats' },
    { key: 'bookings', label: '🎫 Bookings' },
    { key: 'users',    label: '👥 Users' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: COLORS.bg, padding: '32px 20px', fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ color: COLORS.text, fontSize: 26, fontWeight: 700, margin: 0 }}>
            ⚙ Admin Dashboard
          </h1>
          <p style={{ color: COLORS.muted, margin: '6px 0 0', fontSize: 14 }}>Manage bookings, users, and view platform stats</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 28 }}>
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '9px 20px',
                borderRadius: 10,
                border: `1px solid ${tab === t.key ? COLORS.green : COLORS.border}`,
                background: tab === t.key ? 'rgba(82,183,136,0.15)' : 'transparent',
                color: tab === t.key ? COLORS.greenLight : COLORS.muted,
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: 14,
                transition: 'all 0.2s',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '12px 16px', color: '#ef4444', marginBottom: 20, fontSize: 14 }}>
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ color: COLORS.muted, textAlign: 'center', padding: 40, fontSize: 15 }}>Loading…</div>
        )}

        {/* ── STATS TAB ── */}
        {tab === 'stats' && !loading && stats && (
          <div>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 28 }}>
              {[
                { label: 'Total Users',         value: stats.total_users,         icon: '👥' },
                { label: 'Total Bookings',       value: stats.total_bookings,      icon: '🎫' },
                { label: 'Paid Bookings',        value: stats.paid_bookings,       icon: '✅' },
                { label: 'Tickets Sold',         value: stats.total_tickets_sold,  icon: '🌿' },
                { label: 'Total Revenue',        value: `₹${stats.total_revenue.toLocaleString()}`, icon: '💰' },
              ].map(s => (
                <div key={s.label} style={statCardStyle}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
                  <div style={{ color: COLORS.greenLight, fontSize: 26, fontWeight: 700 }}>{s.value}</div>
                  <div style={{ color: COLORS.muted, fontSize: 12, marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bookings by status */}
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, padding: 24 }}>
              <h3 style={{ color: COLORS.greenLight, margin: '0 0 16px', fontSize: 15 }}>Bookings by Status</h3>
              <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                {Object.entries(stats.bookings_by_status).map(([status, count]) => (
                  <div key={status} style={{ textAlign: 'center', padding: '14px 24px', background: '#1a2e22', borderRadius: 10 }}>
                    <StatusBadge status={status} />
                    <div style={{ color: COLORS.text, fontSize: 22, fontWeight: 700, marginTop: 8 }}>{count}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {tab === 'bookings' && !loading && (
          <div>
            {/* Filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
              <span style={{ color: COLORS.muted, fontSize: 13 }}>Filter:</span>
              {['', 'SUCCESS', 'PENDING', 'FAILED'].map(s => (
                <button
                  key={s || 'all'}
                  onClick={() => setStatusFilter(s)}
                  style={{
                    padding: '5px 14px',
                    borderRadius: 8,
                    border: `1px solid ${statusFilter === s ? COLORS.green : COLORS.border}`,
                    background: statusFilter === s ? 'rgba(82,183,136,0.12)' : 'transparent',
                    color: statusFilter === s ? COLORS.greenLight : COLORS.muted,
                    cursor: 'pointer',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {s || 'All'}
                </button>
              ))}
              <span style={{ marginLeft: 'auto', color: COLORS.muted, fontSize: 13 }}>{bookings.length} records</span>
            </div>

            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {['ID', 'Name', 'Email', 'Date', 'Tickets', 'Amount', 'Status', 'Booked At', 'Action'].map(h => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.length === 0 ? (
                      <tr><td colSpan={9} style={{ ...tdStyle, textAlign: 'center', color: COLORS.muted, padding: 32 }}>No bookings found</td></tr>
                    ) : bookings.map(b => (
                      <tr key={b.id} style={{ transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = '#1a2e22'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={tdStyle}><span style={{ color: COLORS.muted }}>#{b.id}</span></td>
                        <td style={tdStyle}>{b.name}</td>
                        <td style={{ ...tdStyle, color: COLORS.muted, fontSize: 12 }}>{b.email}</td>
                        <td style={tdStyle}>{b.date}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>{b.tickets}</td>
                        <td style={{ ...tdStyle, color: COLORS.greenLight }}>₹{b.amount}</td>
                        <td style={tdStyle}><StatusBadge status={b.payment_status} /></td>
                        <td style={{ ...tdStyle, color: COLORS.muted, fontSize: 12 }}>
                          {b.created_at ? new Date(b.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' }) : '—'}
                        </td>
                        <td style={tdStyle}>
                          <button
                            onClick={() => setConfirm({ type: 'booking', id: b.id, label: `Booking #${b.id} (${b.name})` })}
                            style={{ padding: '5px 12px', borderRadius: 7, border: 'none', background: 'rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── USERS TAB ── */}
        {tab === 'users' && !loading && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
              <span style={{ color: COLORS.muted, fontSize: 13 }}>{users.length} users</span>
            </div>
            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={tableStyle}>
                  <thead>
                    <tr>
                      {['ID', 'Username', 'Email', 'Bookings', 'Role', 'Actions'].map(h => (
                        <th key={h} style={thStyle}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={6} style={{ ...tdStyle, textAlign: 'center', color: COLORS.muted, padding: 32 }}>No users found</td></tr>
                    ) : users.map(u => (
                      <tr key={u.id} onMouseEnter={e => e.currentTarget.style.background = '#1a2e22'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={tdStyle}><span style={{ color: COLORS.muted }}>#{u.id}</span></td>
                        <td style={tdStyle}>{u.username}</td>
                        <td style={{ ...tdStyle, color: COLORS.muted, fontSize: 12 }}>{u.email}</td>
                        <td style={{ ...tdStyle, textAlign: 'center' }}>{u.booking_count}</td>
                        <td style={tdStyle}>
                          {u.is_admin
                            ? <span style={{ background: 'rgba(255,209,102,0.15)', color: COLORS.yellow, padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>Admin</span>
                            : <span style={{ background: 'rgba(148,163,184,0.1)', color: '#94a3b8', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>User</span>
                          }
                        </td>
                        <td style={{ ...tdStyle, display: 'flex', gap: 8 }}>
                          <button
                            onClick={() => toggleAdmin(u.id, u.username)}
                            style={{ padding: '5px 12px', borderRadius: 7, border: 'none', background: 'rgba(255,209,102,0.12)', color: COLORS.yellow, cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                          >
                            {u.is_admin ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => setConfirm({ type: 'user', id: u.id, label: `User "${u.username}"` })}
                            style={{ padding: '5px 12px', borderRadius: 7, border: 'none', background: 'rgba(239,68,68,0.12)', color: '#ef4444', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {confirm && (
        <ConfirmModal
          message={`Delete ${confirm.label}? This cannot be undone.`}
          onConfirm={() => {
            if (confirm.type === 'booking') deleteBooking(confirm.id)
            if (confirm.type === 'user')    deleteUser(confirm.id)
            setConfirm(null)
          }}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24,
          background: '#1a3a28', border: `1px solid ${COLORS.green}`,
          color: COLORS.greenLight, padding: '12px 20px', borderRadius: 10,
          fontSize: 14, fontWeight: 500, zIndex: 9999,
          boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        }}>
          ✓ {toast}
        </div>
      )}
    </div>
  )
}
