import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormComponent'
import { loginUser } from '../slices/userSlice' // Import the signIn action from your slice

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('') // For displaying validation errors
  const { userInfo } = useSelector(state => state.user)
  const dispatch = useDispatch()

  const navigate = useNavigate()
  useEffect(() => {
    console.log('thsiis working ' + userInfo)
    if (userInfo) {
      navigate('/home')
    }
  }, [navigate, userInfo])
  const validateForm = () => {
    if (!email || !password) {
      setError('Please fill in all fields.')
      return false
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailPattern.test(email)) {
      setError('Please enter a valid email address.')
      return false
    }

    setError('')
    return true
  }

  const submitHandler = async e => {
    e.preventDefault()

    if (!validateForm()) {
      return // If validation fails, stop the form submission
    }

    try {
      // Call the signIn function (which will make the API request and dispatch the data)
      const userInfo = await dispatch(loginUser({ email, password })).unwrap()

      // If successful, redirect to the home page
      navigate('/home')
    } catch (err) {
      setError('Invalid email or password.')
      console.error('Login failed:', err)
    }
  }

  return (
    <FormContainer>
      <h1>Sign In</h1>
      {error && <div className='alert alert-danger'>{error}</div>}{' '}
      {/* Display error messages */}
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='email'
            placeholder='Enter Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>
          Submit
        </Button>

        <Row className='py-3'>
          <Col>
            Don't have an account? <Link to='/signup'>Sign Up now</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}

export default LoginPage
