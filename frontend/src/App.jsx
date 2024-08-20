import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Header from './components/header'
import MainPage from './pages/MainPage'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignupPage'
import HomePage from './pages/HomePage'
import UserDetailsPage from './pages/UserDetailsPage'
import AdminLoginPage from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<MainPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/home' element={<HomePage />} />
        <Route path='/profile' element={<UserDetailsPage />} />
        <Route path='/admin/login' element={<AdminLoginPage />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/*' element={<NotFoundPage />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  )
}
export default App
