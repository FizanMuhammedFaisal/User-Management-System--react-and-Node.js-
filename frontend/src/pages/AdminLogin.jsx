import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormComponent'
import { loginAdmin } from '../slices/adminSlice'

function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const {
    loading,
    error: errorSlice,
    adminInfo
  } = useSelector(state => state.admin)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    setError('')
    if (adminInfo) {
      navigate('/admin/dashboard')
    }
    if (errorSlice) {
      setError(errorSlice)
    }
  }, [errorSlice, navigate, adminInfo])

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
      return
    }

    try {
      const adminInfo = await dispatch(loginAdmin({ email, password })).unwrap()
      console.log(adminInfo)
      navigate('/admin/dashboard')
    } catch (err) {
      console.error('Login failed:', err)
      // The error will be handled by the useEffect hook updating the `error` state
    }
  }

  return (
    <FormContainer>
      <h1>Admin Sign In</h1>
      {error && <div className='alert alert-danger'>{error}</div>}{' '}
      {/* Display any error message */}
      <Form onSubmit={submitHandler}>
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='text'
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

        <Row className='py-3'></Row>
      </Form>
    </FormContainer>
  )
}

export default AdminLoginPage
