import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import { Button } from 'react-bootstrap'
import { logoutUser } from '../slices/userSlice'
import { useDispatch } from 'react-redux'
const HomePage = () => {
  const [userName, setUserName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleLogout = async () => {
    try {
      await apiClient.post('/api/users/logout')
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUserName('')
      dispatch(logoutUser())
      // Redirect the user to the login page or home page
      navigate('/login')
    } catch (error) {
      console.error('Failed to logout:', error)
    }
  }
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiClient.get('/api/users/profile')

        console.log(response.data)
        setUserName(response.data.name)
      } catch (error) {
        // Handle errors
        console.error('Failed to fetch user data:', error)

        if (error.response?.status === 401) {
          // If unauthorized, redirect to login page
          navigate('/login')
        } else {
          // Set error message for other errors
          setError(
            'An error occurred while fetching user data. Please try again later.'
          )
        }
      } finally {
        // Set loading to false once the request is complete
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  if (loading) {
    return <div>Loading...</div> // Show a loading indicator while fetching data
  }

  if (error) {
    return <div>{error}</div> // Display error message if there was an error
  }

  return (
    <div>
      <h1>Welcome, {userName}!</h1>
      <Button
        onClick={() => {
          handleLogout()
        }}
      >
        LogOut
      </Button>
      <Button
        onClick={() => {
          navigate('/profile')
        }}
      >
        Profile
      </Button>
    </div>
  )
}

export default HomePage
