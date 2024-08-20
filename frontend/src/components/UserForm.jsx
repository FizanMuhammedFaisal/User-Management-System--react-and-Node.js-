import React, { useState, useEffect } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'

const UserForm = ({
  form,
  handleInputChange,
  handleSubmit,
  formErrors,
  setShowAddUserForm
}) => {
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState({})

  // Update local errors state when formErrors prop changes
  useEffect(() => {
    if (formErrors && Object.keys(formErrors).length > 0) {
      setErrors({})
      // setShowAddUserForm(false)
    }
  }, [formErrors])

  const validatePasswordStrength = password => {
    const conditions = [
      {
        test: password.length >= 8,
        error: 'Password must be at least 8 characters long.'
      },
      {
        test: /\d/.test(password),
        error: 'Password must contain at least one number.'
      },
      {
        test: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        error: 'Password must contain at least one special character.'
      },
      {
        test: /[A-Z]/.test(password),
        error: 'Password must contain at least one uppercase letter.'
      },
      {
        test: /[a-z]/.test(password),
        error: 'Password must contain at least one lowercase letter.'
      }
    ]

    for (const condition of conditions) {
      if (!condition.test) return condition.error
    }
    return ''
  }

  const validateForm = () => {
    const formErrors = {}
    if (!form.name) formErrors.name = 'Name is required.'
    if (!form.email) formErrors.email = 'Email is required.'

    const passwordError = validatePasswordStrength(form.password)
    if (!form.password) formErrors.password = 'Password is required.'
    else if (passwordError) formErrors.password = passwordError

    if (!confirmPassword) {
      formErrors.confirmPassword = 'Confirm Password is required.'
    } else if (confirmPassword !== form.password) {
      formErrors.confirmPassword = 'Passwords do not match.'
    }

    return formErrors
  }

  const handlePasswordChange = e => {
    handleInputChange(e)
    setErrors(prevErrors => ({
      ...prevErrors,
      password: validatePasswordStrength(e.target.value)
    }))
  }

  const handleConfirmPasswordChange = e => {
    handleInputChange(e)
    setConfirmPassword(e.target.value)
    setErrors(prevErrors => ({
      ...prevErrors,
      confirmPassword:
        e.target.value !== form.password ? 'Passwords do not match.' : ''
    }))
  }

  const onSubmit = e => {
    e.preventDefault()
    const formErrors = validateForm()
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors)
      return
    }
    handleSubmit()
  }

  return (
    <Form className='mb-4' onSubmit={onSubmit}>
      {Object.keys(errors).length > 0 && (
        <Alert variant='danger' className='mb-3'>
          {Object.values(errors).map((error, index) => (
            <div key={index}>{error}</div>
          ))}
        </Alert>
      )}

      <Form.Group controlId='formName'>
        <Form.Label>Name</Form.Label>
        <Form.Control
          type='text'
          name='name'
          value={form.name}
          onChange={handleInputChange}
          placeholder='Enter name'
          isInvalid={!!errors.name}
        />
        <Form.Control.Feedback type='invalid'>
          {errors.name}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId='formEmail'>
        <Form.Label>Email</Form.Label>
        <Form.Control
          type='email'
          name='email'
          value={form.email}
          onChange={handleInputChange}
          placeholder='Enter email'
          isInvalid={!!errors.email}
        />
        <Form.Control.Feedback type='invalid'>
          {errors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId='formPassword'>
        <Form.Label>Password</Form.Label>
        <Form.Control
          type='password'
          name='password'
          value={form.password}
          onChange={handlePasswordChange}
          placeholder='Enter password'
          isInvalid={!!errors.password}
        />
        <Form.Control.Feedback type='invalid'>
          {errors.password}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group controlId='formConfirmPassword'>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          type='password'
          name='confirm'
          value={form.confirm}
          onChange={handleConfirmPasswordChange}
          placeholder='Confirm password'
          isInvalid={!!errors.confirmPassword}
        />
        <Form.Control.Feedback type='invalid'>
          {errors.confirmPassword}
        </Form.Control.Feedback>
      </Form.Group>

      <Button variant='primary' type='submit' className='mt-3'>
        Create User
      </Button>
    </Form>
  )
}

export default UserForm
