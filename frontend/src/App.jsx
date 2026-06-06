import { BrowserRouter, Routes, Route } from 'react-router-dom'

import { AuthProvider } from './context/AuthContext'

import Navbar from './components/Navbar'

import Footer from './components/Footer'

import Home from './pages/Home'

import Register from './pages/Register'

import Login from './pages/Login'

import BookTicket from './pages/BookTicket'

import Payment from './pages/Payment'

import TicketConfirmation from './pages/TicketConfirmation'

import Contact from './pages/Contact'

import Adventure from './pages/Adventure'

import GoogleSuccess from './pages/GoogleSuccess'

import AdminDashboard from './pages/AdminDashboard'
import MyBookings from './pages/MyBookings'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'


export default function App() {

  return (

    <AuthProvider>

      <BrowserRouter>

        <div
          style={{
            display:'flex',
            flexDirection:'column',
            minHeight:'100vh'
          }}
        >

          <Navbar />

          <main
            style={{
              flex:1
            }}
          >

            <Routes>

              <Route
                path="/"
                element={<Home />}
              />

              <Route
                path="/book_ticket"
                element={<BookTicket />}
              />

              <Route
                path="/contact"
                element={<Contact />}
              />

              <Route
                path="/register"
                element={<Register />}
              />

              <Route
                path="/login"
                element={<Login />}
              />

              <Route
                path="/process_payment/:ticketId"
                element={<Payment />}
              />

              <Route
                path="/ticket_confirmation/:ticketId"
                element={<TicketConfirmation />}
              />

              <Route
                path="/adventure"
                element={<Adventure />}
              />

              <Route
                path="/google-success"
                element={<GoogleSuccess />}
              />

              <Route
                path="/admin"
                element={<AdminDashboard />}
              />

              <Route
                path="/my-bookings"
                element={<MyBookings />}
              />

              <Route
                path="/forgot-password"
                element={<ForgotPassword />}
              />

              <Route
                path="/reset-password"
                element={<ResetPassword />}
              />

            </Routes>

          </main>

          <Footer />

        </div>

      </BrowserRouter>

    </AuthProvider>

  )
}