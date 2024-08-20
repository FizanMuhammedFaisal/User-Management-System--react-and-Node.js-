import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  addUsers,
  updateUser,
  fetchUsers,
  deleteUser
} from '../slices/userActionSlice'
import { logoutAdmin } from '../slices/adminSlice'
import { useNavigate } from 'react-router-dom'
import apiClient from '../api/apiClient'

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const { adminInfo } = useSelector(state => state.admin)
  const { users, loading, error, res } = useSelector(state => state.userActions)

  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [editingUser, setEditingUser] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [formErrors, setFormErrors] = useState([])
  const [setErrorOnTope, setSetErrorOnTope] = useState('')

  const navigate = useNavigate()
  useEffect(() => {
    // Redirect to login page if adminInfo is null
    if (!adminInfo) {
      navigate('/admin/login')
    } else {
      dispatch(fetchUsers())

      setSetErrorOnTope(error)
    }
  }, [dispatch, adminInfo, navigate])

  const validate = () => {
    const errors = []
    const { name, email, password } = form
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedName) {
      errors.push('Name is required')
    } else if (trimmedName.length < 2) {
      errors.push('Name must be at least 2 characters long')
    }

    if (!trimmedEmail) {
      errors.push('Email is required')
    } else if (!/\S+@\S+\.\S+/.test(trimmedEmail)) {
      errors.push('Email address is invalid')
    }

    if (!trimmedPassword && !editingUser) {
      errors.push('Password is required')
    } else if (trimmedPassword.length < 6 && !editingUser) {
      errors.push('Password must be at least 6 characters')
    } else if (
      trimmedPassword &&
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}/.test(trimmedPassword)
    ) {
      errors.push(
        'Password must include at least one uppercase letter, one lowercase letter, and one number'
      )
    }

    console.log('Validation errors:', errors)
    return errors
  }

  const handleInputChange = e => {
    const { name, value } = e.target
    setForm(prevForm => ({ ...prevForm, [name]: value }))
  }

  const handleCreateUser = () => {
    const errors = validate()
    if (errors.length === 0) {
      console.log(form)
      console.log('no errors')
      dispatch(addUsers(form))
      setForm({ name: '', email: '', password: '' })
      setFormErrors([])
    } else {
      setFormErrors(errors)
    }
  }

  const handleupdateUser = async () => {
    console.log('on handle updata')
    const errors = validate()

    if (errors.length === 0 && editingUser.email) {
      console.log(form, editingUser.email)

      const data = { ...form, prev: editingUser.email }
      console.log(data)
      try {
        const response = await apiClient.put('/api/admin/updateuser', data)
        console.log(response.data)
        setEditingUser(null)
      } catch (errorof) {
        const err = errorof.response?.data?.message
        console.log(err)
        setSetErrorOnTope(err)
      }
    } else {
      setFormErrors(errors)
    }
  }

  const handleEditUser = user => {
    setEditingUser(user)
    setForm({ name: user.name, email: user.email, password: '' })
    setFormErrors([])
  }
  const handlewho = () => {
    editingUser ? handleupdateUser() : handleCreateUser()
  }
  const handledeleteUser = userId => {
    dispatch(deleteUser(userId))
  }

  const handleLogout = () => {
    dispatch(logoutAdmin()).then(() => {
      navigate('/admin/login')
    })
  }

  const filteredUsers = users.filter(
    user =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className='min-h-screen flex flex-col items-center bg-gray-100 p-4'>
      <h1 className='text-3xl font-bold mb-6'>Admin Dashboard</h1>
      <div className='w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mb-6'>
        <h2 className='text-2xl font-bold mb-4'>
          {editingUser ? 'Edit User' : 'Create User'}
        </h2>
        <div className='p-2'>
          <p className='text-red-500'>{setErrorOnTope}</p>
          <p className='text-red-500'>{error}</p>
        </div>
        {/* <h1>{res?.message || ''}</h1> */}

        <div className='mb-4'>
          <label className='block text-gray-700 mb-2'>Name</label>
          <input
            type='text'
            name='name'
            value={form.name}
            onChange={handleInputChange}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
          {formErrors.includes('Name is required') && (
            <p className='text-red-500'>Name is required</p>
          )}
          {formErrors.includes('Name must be at least 2 characters long') && (
            <p className='text-red-500'>
              Name must be at least 2 characters long
            </p>
          )}
        </div>
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2'>Email</label>
          <input
            type='email'
            name='email'
            value={form.email}
            onChange={handleInputChange}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
          {formErrors.includes('Email is required') && (
            <p className='text-red-500'>Email is required</p>
          )}
          {formErrors.includes('Email address is invalid') && (
            <p className='text-red-500'>Email address is invalid</p>
          )}
        </div>

        <div className='mb-4'>
          <label className='block text-gray-700 mb-2'>Password</label>
          <input
            type='password'
            name='password'
            value={form.password}
            onChange={handleInputChange}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            required
          />
          {formErrors.includes('Password is required') && (
            <p className='text-red-500'>Password is required</p>
          )}
          {formErrors.includes('Password must be at least 6 characters') && (
            <p className='text-red-500'>
              Password must be at least 6 characters
            </p>
          )}
          {formErrors.includes(
            'Password must include at least one uppercase letter, one lowercase letter, and one number'
          ) && (
            <p className='text-red-500'>
              Password must include at least one uppercase letter, one lowercase
              letter, and one number
            </p>
          )}
        </div>

        <button
          onClick={() => {
            handlewho()
          }}
          className='w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          {editingUser ? 'Update User' : 'Create User'}
        </button>
      </div>
      <div className='w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg mb-6'>
        <h2 className='text-2xl font-bold mb-4'>User List</h2>
        <button
          className='p-2 px-5 bg-green-500 rounded-md'
          onClick={() => {
            dispatch(fetchUsers())
          }}
        >
          fetch
        </button>
        <div className='mb-4'>
          <label className='block text-gray-700 mb-2'>Search</label>
          <input
            type='text'
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className='w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
            placeholder='Search by name or email'
          />
        </div>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className='w-full text-left table-auto'>
            <thead>
              <tr>
                <th className='px-4 py-2 border-b'>ID</th>
                <th className='px-4 py-2 border-b'>Name</th>
                <th className='px-4 py-2 border-b'>Email</th>
                <th className='px-4 py-2 border-b'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length ? (
                filteredUsers.map(user => (
                  <tr key={user._id}>
                    <td className='px-4 py-2 border-b'>{user._id}</td>
                    <td className='px-4 py-2 border-b'>{user.name}</td>
                    <td className='px-4 py-2 border-b'>{user.email}</td>
                    <td className='px-4 py-2 border-b'>
                      <button
                        onClick={() => handleEditUser(user)}
                        className='bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handledeleteUser(user._id)}
                        className='bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 ml-2'
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan='4' className='px-4 py-2 border-b text-center'>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <button
        onClick={handleLogout}
        className='bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500'
      >
        Logout
      </button>
    </div>
  )
}

export default AdminDashboard
