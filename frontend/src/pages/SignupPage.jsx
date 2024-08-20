import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Form, Button, Row, Col, Alert } from 'react-bootstrap'
import FormContainer from '../components/FormComponent'
import { signUpUser } from '../slices/userSlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
function SignUpPage() {
  const navigate = useNavigate()
  const { userInfo, loading, error } = useSelector(state => state.user)
  useEffect(() => {
    // If there's no error clear erros
    if (!error) {
      setDisError('')
      if (userInfo) {
        console.log(userInfo)
        navigate('/home')
      }
    } else {
      setDisError(error)
    }
  }, [error, userInfo])

  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [image, setImage] = useState(null)
  // Error state
  const [disError, setDisError] = useState('')
  //
  //
  //
  // Custom email validation function
  const isValidEmail = email => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }
  //
  const submitHandler = async e => {
    e.preventDefault()
    setDisError('')
    // Check if any field is empty
    if (!username || !email || !password || !confirmPassword) {
      setDisError('All fields are required')
      return
    }
    //password checking
    if (password !== confirmPassword) {
      setDisError('Passwords do not match')
      return
    }
    //email validation checking
    if (!isValidEmail(email)) {
      setDisError('Invalid email address')
      return
    }
    // Create FormData instance
    const formData = new FormData()
    formData.append('name', username)
    formData.append('email', email)
    formData.append('password', password)
    formData.append('confirmPassword', confirmPassword)
    if (image) {
      formData.append('image', image)
    }
    try {
      console.log('Form submitted successfully')
      console.log(formData, username, email, password, confirmPassword, image)
      dispatch(signUpUser(formData))
    } catch (error) {
      console.log('error happened in sublmitting')
      setDisError('Failed to Register , Please Try Again')
    }
  }

  const handleImageChange = e => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setImage(file)
    } else {
      alert('Please upload a valid image file.')
      setImage(null)
    }
  }

  return (
    <FormContainer>
      <h1>Sign Up</h1>
      {disError && <Alert variant='danger'>{disError}</Alert>}{' '}
      {/* Display error message */}
      <Form onSubmit={submitHandler}>
        {/* Username */}
        <Form.Group className='my-2' controlId='username'>
          <Form.Label>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Username'
            value={username}
            onChange={e => setUsername(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* Email */}
        <Form.Group className='my-2' controlId='email'>
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* Password */}
        <Form.Group className='my-2' controlId='password'>
          <Form.Label>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Enter Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* Confirm Password */}
        <Form.Group className='my-2' controlId='confirmPassword'>
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>

        {/* Profile Picture Upload */}
        <Form.Group className='my-2' controlId='image'>
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control
            type='file'
            onChange={handleImageChange}
            accept='image/*'
          ></Form.Control>
        </Form.Group>

        <Button type='submit' variant='primary' className='mt-3'>
          Submit
        </Button>

        <Row className='py-3'>
          <Col>
            Already have an account? <Link to='/login'>Sign in now</Link>
          </Col>
        </Row>
      </Form>
    </FormContainer>
  )
}

export default SignUpPage
