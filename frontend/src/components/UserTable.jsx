import React from 'react'
import { Table, Button, Form } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

const UserTable = ({
  users,
  onEdit,
  onDelete,
  loading,
  error,
  searchQuery,
  onSearchChange
}) => {
  const navigate = useNavigate()

  const handleEdit = userId => {
    navigate(`/edit-user/${userId}`) // Navigate to the edit page
  }

  return (
    <>
      <Form.Control
        type='text'
        value={searchQuery}
        onChange={e => onSearchChange(e.target.value)}
        placeholder='Search by name or email'
        className='mb-4'
      />
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <div className='text-danger'>{error}</div>
      ) : (
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map(user => (
                <tr key={user._id}>
                  <td>{user._id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <Button
                      variant='warning'
                      onClick={() => handleEdit(user._id)}
                      className='me-2'
                    >
                      Edit
                    </Button>
                    <Button variant='danger' onClick={() => onDelete(user._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='4' className='text-center text-muted'>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      )}
    </>
  )
}

export default UserTable
