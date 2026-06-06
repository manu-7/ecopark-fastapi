import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

import api from '../api/axios'
import Alert from '../components/Alert'

export default function Payment() {

  const { ticketId } = useParams()

  const navigate = useNavigate()

  const [orderData, setOrderData] = useState(null)

  const [error, setError] = useState('')

  const [loading, setLoading] = useState(true)

  const [paying, setPaying] = useState(false)

  const [showCancelConfirm, setShowCancelConfirm] = useState(false)

  const [cancelLoading, setCancelLoading] = useState(false)


  useEffect(() => {

    const fetchPaymentDetails = async () => {

      try {

        const res = await api.get(
          `/payment/process_payment/${ticketId}`
        )

        setOrderData(
          res.data
        )

      } catch (err) {

        setError(
          err.response?.data?.detail ||
          'Failed to load payment details.'
        )

      } finally {

        setLoading(false)
      }
    }

    fetchPaymentDetails()

  }, [ticketId])


  const handleCancel = async () => {

    setCancelLoading(true)

    try {

      await api.delete(
        `/tickets/${ticketId}`
      )

      navigate("/")

    } catch (err) {

      setError(
        err.response?.data?.detail ||
        "Cancellation failed"
      )

    } finally {

      setCancelLoading(false)

      setShowCancelConfirm(false)
    }
  }


  const handlePayment = () => {

    if (!orderData) return

    if (!window.Razorpay) {

      setError(
        'Razorpay SDK not loaded'
      )

      return
    }

    setPaying(true)

    const options = {

      key: orderData.razorpay_key,

      amount: orderData.amount,

      currency: 'INR',

      order_id: orderData.order_id,

      name: 'Eco Park',

      description: 'Eco Park Ticket Booking',

      prefill: {

        name: orderData.name,

        email: orderData.email
      },

      theme: {

        color: '#2d6a4f'
      },

      handler: async (response) => {

        try {

          await api.post(
            '/payment/payment_success',
            {

              ticket_id: parseInt(ticketId),

              razorpay_order_id:
              response.razorpay_order_id,

              razorpay_payment_id:
              response.razorpay_payment_id,

              razorpay_signature:
              response.razorpay_signature
            }
          )

          navigate(
            `/ticket_confirmation/${ticketId}`
          )

        } catch (err) {

          setError(
            err.response?.data?.detail ||
            'Payment confirmation failed.'
          )

        } finally {

          setPaying(false)
        }
      },

      modal: {

        ondismiss: () => {

          setPaying(false)

          setError(
            'Payment cancelled.'
          )
        }
      }
    }

    const rzp = new window.Razorpay(
      options
    )

    rzp.open()
  }


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
          maxWidth:460
        }}
        className="animate-fadeup"
      >

        {loading && <div className="spinner" />}

        {error && (

          <Alert
            type="danger"
            message={error}
            onClose={() => setError('')}
          />

        )}

        {orderData && !loading && (

          <div
            className="card"
            style={{
              padding:32
            }}
          >

            <div
              style={{
                textAlign:'center',
                marginBottom:28
              }}
            >

              <div
                style={{
                  fontSize:48,
                  marginBottom:8
                }}
              >

                💳

              </div>

              <h2
                style={{
                  fontFamily:"'Playfair Display', serif",
                  fontSize:28,
                  color:'var(--forest)'
                }}
              >

                Complete Payment

              </h2>

              <p
                style={{
                  color:'var(--muted)',
                  fontSize:14
                }}
              >

                Secure checkout powered by Razorpay

              </p>

            </div>

            <div
              style={{
                background:'var(--cream)',
                borderRadius:12,
                padding:20,
                marginBottom:25
              }}
            >

              <h4
                style={{
                  marginBottom:18,
                  color:'var(--forest)'
                }}
              >

                Order Summary

              </h4>

              <div
                style={{
                  display:'flex',
                  justifyContent:'space-between',
                  marginBottom:12
                }}
              >

                <span>

                  Ticket ID

                </span>

                <strong>

                  #{ticketId}

                </strong>

              </div>

              <div
                style={{
                  display:'flex',
                  justifyContent:'space-between'
                }}
              >

                <span>

                  Amount Due

                </span>

                <strong
                  style={{
                    color:'var(--leaf)',
                    fontSize:22
                  }}
                >

                  ₹{orderData.amount / 100}

                </strong>

              </div>

            </div>

            <div
              style={{
                display:'flex',
                flexDirection:'column',
                gap:'12px'
              }}
            >

              <button
                className="btn-primary"
                onClick={handlePayment}
                disabled={paying}
              >

                {

                  paying

                  ? "Processing Payment..."

                  : `🔐 Pay ₹${orderData.amount / 100}`

                }

              </button>

              <button
                className="btn-outline"
                onClick={() => setShowCancelConfirm(true)}
              >

                ❌ Cancel Booking

              </button>

            </div>

            {

              showCancelConfirm && (

                <div
                  style={{
                    marginTop:'20px',
                    padding:'20px',
                    border:'1px solid var(--sand)',
                    borderRadius:'12px',
                    textAlign:'center'
                  }}
                >

                  <p
                    style={{
                      fontWeight:'600',
                      color:'var(--forest)'
                    }}
                  >

                    Are you sure you want to cancel this booking?

                  </p>

                  <p
                    style={{
                      fontSize:'13px',
                      color:'var(--muted)',
                      marginBottom:'18px'
                    }}
                  >

                    This action cannot be undone and your reservation slot will be released.

                  </p>

                  <div
                    style={{
                      display:'flex',
                      gap:'10px',
                      justifyContent:'center'
                    }}
                  >

                    <button
                      className="btn-primary"
                      disabled={cancelLoading}
                      onClick={handleCancel}
                    >

                      {

                        cancelLoading

                        ? "Cancelling..."

                        : "Yes, Cancel"

                      }

                    </button>

                    <button
                      className="btn-outline"
                      onClick={() => setShowCancelConfirm(false)}
                    >

                      No

                    </button>

                  </div>

                </div>

              )

            }

          </div>

        )}

      </div>

    </div>

  )
}