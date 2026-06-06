import { useState } from 'react'

export default function Alert({ type, message, onClose }) {
  const [visible, setVisible] = useState(true)
  if (!visible || !message) return null

  const cls = type === 'success' ? 'alert-success'
            : (type === 'danger' || type === 'error') ? 'alert-danger'
            : 'alert-info'

  const icons = { 'alert-success':'✓', 'alert-danger':'✕', 'alert-info':'ℹ' }

  const handleClose = () => { setVisible(false); if (onClose) onClose() }

  return (
    <div className={`alert ${cls}`} style={{ marginBottom: 16 }}>
      <span style={{ display:'flex', alignItems:'center', gap:8 }}>
        <span style={{ fontWeight:700, fontSize:16 }}>{icons[cls]}</span>
        {message}
      </span>
      <button className="alert-close" onClick={handleClose} aria-label="Close">×</button>
    </div>
  )
}
