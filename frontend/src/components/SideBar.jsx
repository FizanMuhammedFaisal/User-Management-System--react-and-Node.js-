// Sidebar.js
import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
  const handleLogout = () => {
    //
  }
  const navigate = useNavigate()
  return (
    <Navbar
      bg='dark'
      variant='dark'
      className='d-flex flex-column align-items-start p-3 vh-100'
    >
      <Navbar.Brand
        onClick={() => {
          navigate('/admin/dashboard')
        }}
        className='mb-3'
      >
        Dashboard
      </Navbar.Brand>
      <Nav className='flex-column w-100'>
        <Nav className='text-light'>Dashboard</Nav>
        <Nav className='text-light'>Users</Nav>
        <Nav onClick={handleLogout} className='text-light'>
          Logout
        </Nav>
      </Nav>
    </Navbar>
  )
}
export default Sidebar
