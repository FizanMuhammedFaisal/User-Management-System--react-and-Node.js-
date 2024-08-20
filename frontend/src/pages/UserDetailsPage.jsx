import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'
import { Button, Container, Row, Col, Alert } from 'react-bootstrap'
import { logoutUser } from '../slices/userSlice'
import { useDispatch } from 'react-redux'

const UserDetailsPage = () => {
  const [details, setDetails] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const imageUrl = details.image ? `http://localhost:5002/${details.image}` : ''
  console.log(imageUrl, details)
  const handleLogout = async () => {
    try {
      await apiClient.post('/api/users/logout')
      localStorage.removeItem('accessToken')
      setDetails('')
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
        // Make a request to verify the user and fetch their data
        const response = await apiClient.get('/api/users/profile')
        // Assuming the response contains the user's name and image URL
        console.log(response.data)
        setDetails(response.data)
      } catch (error) {
        console.error('Failed to fetch user data:', error)
        if (error.response?.status === 401) {
          // If unauthorized, redirect to login page
          navigate('/login')
        } else {
          setError(
            'An error occurred while fetching user data. Please try again later.'
          )
        }
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [navigate])

  if (loading) {
    return <div>Loading...</div> // Show a loading indicator while fetching data
  }

  if (error) {
    return <Alert variant='danger'>{error}</Alert> // Display error message if there was an error
  }

  return (
    <Container className='text-center mt-5'>
      <Row className='justify-content-center'>
        <Col xs={12} md={6} lg={4}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt='Profile'
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover'
              }}
              className='img-fluid rounded-circle profile-image'
            />
          )}
          <div>
            <h1>Welcome, {details.name}!</h1>
            <h2>User Details</h2>
            <p>Name: {details.name}</p>
            <p>Email: {details.email}</p>
            <Button onClick={handleLogout} variant='primary'>
              LogOut
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default UserDetailsPage
