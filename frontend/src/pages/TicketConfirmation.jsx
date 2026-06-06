import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

import api from '../api/axios'

export default function TicketConfirmation() {

  const { ticketId } = useParams()

  const [ticket, setTicket] = useState(null)

  const [error, setError] = useState('')


  useEffect(() => {

    api.get(
      `/tickets/ticket_confirmation/${ticketId}`
    )

    .then((res) => {

      setTicket(
        res.data
      )

    })

    .catch(() => {

      setError(
        'Failed to load ticket details.'
      )

    })

  }, [ticketId])


  const handleDownload = () => {

    const token =
      localStorage.getItem(
        'token'
      )

    fetch(
      `/api/tickets/download_ticket/${ticketId}`,
      {
        headers: {
          Authorization:
          `Bearer ${token}`
        }
      }
    )

    .then((res) => {

      if (!res.ok) {

        throw new Error()
      }

      return res.blob()

    })

    .then((blob) => {

      const url =
        URL.createObjectURL(blob)

      const a =
        document.createElement('a')

      a.href = url

      a.download =
        `ticket_${ticketId}.pdf`

      a.click()

      URL.revokeObjectURL(url)

    })

    .catch(() => {

      setError(
        "Failed to download ticket"
      )

    })
  }


  if (error)

    return (

      <div
        style={{
          minHeight:'60vh',
          display:'flex',
          alignItems:'center',
          justifyContent:'center',
          padding:40
        }}
      >

        <div
          style={{
            background:'#fde8e6',
            color:'#8b2018',
            padding:20,
            borderRadius:12,
            textAlign:'center'
          }}
        >

          {error}

        </div>

      </div>

    )


  if (!ticket)

    return (

      <div
        style={{
          minHeight:'60vh',
          display:'flex',
          alignItems:'center',
          justifyContent:'center'
        }}
      >

        <div className="spinner" />

      </div>

    )


  return (

    <div
      style={{
        minHeight:'80vh',
        display:'flex',
        alignItems:'center',
        justifyContent:'center',
        padding:'40px 20px',
        background:'var(--cream)'
      }}
    >

      <div
        style={{
          width:'100%',
          maxWidth:420
        }}
        className="animate-fadeup"
      >

        <div
          style={{
            textAlign:'center',
            marginBottom:28
          }}
        >

          <div
            style={{
              width:72,
              height:72,
              borderRadius:'50%',
              background:'linear-gradient(135deg,var(--leaf),var(--sage))',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              margin:'0 auto 14px',
              fontSize:32
            }}
          >

            ✓

          </div>

          <h2
            style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:26,
              color:'var(--forest)'
            }}
          >

            Booking Confirmed!

          </h2>

        </div>


        <div
          className="card"
          style={{
            padding:30
          }}
        >

          <div
            style={{
              background:'var(--cream)',
              borderRadius:12,
              padding:20,
              marginBottom:24
            }}
          >

            {[
              ['🎫 Ticket ID', `#${ticketId}`],
              ['👤 Name', ticket.name],
              ['✉️ Email', ticket.email],
              ['📅 Date', ticket.date],
              ['🎟 Tickets', ticket.tickets],
              ['💰 Amount Paid', `₹${ticket.total_amount}`],
            ]

            .map(([k, v]) => (

              <div
                key={k}
                style={{
                  display:'flex',
                  justifyContent:'space-between',
                  marginBottom:10
                }}
              >

                <span>

                  {k}

                </span>

                <strong>

                  {v}

                </strong>

              </div>

            ))}


            <div
              style={{
                display:"flex",
                justifyContent:"space-between",
                marginTop:"10px"
              }}
            >

              <span>

                Payment Status

              </span>

              <span
                style={{

                  padding:"6px 12px",

                  borderRadius:"20px",

                  fontSize:"12px",

                  fontWeight:"600",

                  background:

                  ticket.payment_status === "SUCCESS"

                  ? "#d4edda"

                  : ticket.payment_status === "CANCELLED"

                  ? "#f8d7da"

                  : "#fff3cd",

                  color:

                  ticket.payment_status === "SUCCESS"

                  ? "#155724"

                  : ticket.payment_status === "CANCELLED"

                  ? "#721c24"

                  : "#856404"
                }}
              >

                {ticket.payment_status}

              </span>

            </div>

          </div>


          {

            ticket.payment_status === "SUCCESS" &&
            ticket.qr_code_url && (

              <div
                style={{
                  textAlign:'center',
                  marginBottom:24
                }}
              >

                <img
                  src={ticket.qr_code_url}
                  alt="QR"
                  style={{
                    width:140,
                    height:140
                  }}
                />

              </div>

            )

          }


          <div
            style={{
              display:'flex',
              flexDirection:'column',
              gap:10
            }}
          >

            <button
              className="btn-primary"
              disabled={
                ticket.payment_status !== "SUCCESS"
              }
              onClick={handleDownload}
            >

              📥 Download PDF Ticket

            </button>

            <Link
              to="/"
              className="btn-outline"
              style={{
                textAlign:'center',
                padding:'12px'
              }}
            >

              ← Back to Home

            </Link>

          </div>

        </div>

      </div>

    </div>

  )
}