import { useState, useContext } from 'react'

import { Link, useNavigate } from 'react-router-dom'

import { GoogleLogin } from '@react-oauth/google'

import { AuthContext } from '../context/AuthContext'

import api from '../api/axios'

import Alert from '../components/Alert'


export default function Register() {

  const [form, setForm] = useState({

    username:'',

    email:'',

    password:'',

    password2:''

  })

  const [error, setError] = useState('')

  const [loading, setLoading] = useState(false)

  const { setToken } = useContext(
    AuthContext
  )

  const navigate = useNavigate()


  const handleChange = (e) => {

    setForm({

      ...form,

      [e.target.name]:
      e.target.value
    })
  }


  const handleSubmit = async (e) => {

    e.preventDefault()

    setError('')

    setLoading(true)

    try {

      const res = await api.post(

        '/auth/register',

        form
      )

      setToken(

        res.data.access_token,

        res.data.username,

        res.data.is_admin
      )

      navigate('/')

    } catch (err) {

      setError(

        err.response?.data?.detail ||

        'Registration failed. Please try again.'
      )

    } finally {

      setLoading(false)
    }
  }


  const fields = [

    {

      name:'username',

      label:'Username',

      type:'text',

      placeholder:'Choose a username'
    },

    {

      name:'email',

      label:'Email Address',

      type:'email',

      placeholder:'your@email.com'
    },

    {

      name:'password',

      label:'Password',

      type:'password',

      placeholder:'Create a strong password'
    },

    {

      name:'password2',

      label:'Confirm Password',

      type:'password',

      placeholder:'Repeat your password'
    }
  ]


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
          maxWidth:460,
          position:'relative',
          zIndex:1
        }}
        className="animate-fadeup"
      >

        <div
          style={{
            textAlign:'center',
            marginBottom:32
          }}
        >

          <div
            style={{
              width:56,
              height:56,
              borderRadius:'50%',
              background:'var(--leaf)',
              display:'flex',
              alignItems:'center',
              justifyContent:'center',
              margin:'0 auto 16px',
              fontSize:24
            }}
          >

            🌱

          </div>

          <h2
            style={{
              fontFamily:
              "'Playfair Display',serif",

              fontSize:28,

              color:'var(--forest)'
            }}
          >

            Join Eco Park

          </h2>

        </div>


        <div
          className="card"
          style={{
            padding:32
          }}
        >

          {

            error && (

              <Alert

                type="danger"

                message={error}

                onClose={() => setError('')}

              />

            )

          }

          <form onSubmit={handleSubmit}>

            {

              fields.map(

                (f, i) => (

                  <div
                    key={f.name}
                    style={{
                      marginBottom:

                      i < fields.length - 1

                      ? 18

                      : 28
                    }}
                  >

                    <label className="form-label">

                      {f.label}

                    </label>

                    <input

                      type={f.type}

                      name={f.name}

                      className="form-control"

                      value={form[f.name]}

                      onChange={handleChange}

                      required

                      placeholder={f.placeholder}
                    />

                  </div>

                )
              )

            }

            <button

              className="btn-primary"

              type="submit"

              disabled={loading}

              style={{
                width:'100%',
                padding:'13px',
                fontSize:15
              }}
            >

              {

                loading

                ? 'Creating account...'

                : '→ Create Account'

              }

            </button>

          </form>


          <div
            style={{
              marginTop:'24px',
              display:'flex',
              flexDirection:'column',
              alignItems:'center',
              gap:'12px'
            }}
          >

            <p
              style={{
                fontSize:'13px',
                color:'var(--muted)'
              }}
            >

              Or continue with Google

            </p>

            <GoogleLogin

              onSuccess={() => {

                window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google/login`

              }}

              onError={() => {

                setError(
                  'Google login failed'
                )

              }}

            />

          </div>


          <div
            style={{
              textAlign:'center',
              marginTop:20,
              paddingTop:20,
              borderTop:'1px solid var(--sand)'
            }}
          >

            <span
              style={{
                fontSize:13,
                color:'var(--muted)'
              }}
            >

              Already have an account?{' '}

              <Link
                to="/login"
                style={{
                  color:'var(--leaf)',
                  fontWeight:600
                }}
              >

                Sign in

              </Link>

            </span>

          </div>

        </div>

      </div>

    </div>

  )
}