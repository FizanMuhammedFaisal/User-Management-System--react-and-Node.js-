import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../api/apiClient'

// Fetch users
export const fetchUsers = createAsyncThunk(
  'getusers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/api/admin/getusers')
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// Add user
export const addUsers = createAsyncThunk(
  'adduser',
  async (userData, { rejectWithValue }) => {
    try {
      if (!userData.password) {
        throw new Error('Password is required')
      }
      const res = await apiClient.post('/api/admin/adduser', userData)
      if (res.status == 201) {
        return res.data
      }
    } catch (error) {
      console.log(error.response.data)
      return rejectWithValue(error.response?.data.message || error.message)
    }
  }
)

// Delete user
export const deleteUser = createAsyncThunk(
  'deleteusers',
  async (userId, { rejectWithValue }) => {
    console.log('userid' + userId)
    try {
      const res = await apiClient.post('/api/admin/deleteuser', { id: userId })
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// Update user
export const updateUser = createAsyncThunk(
  'updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      if (!userData.email) {
        throw new Error('Email is required for update')
      }

      // Add password if it's included in the payload
      const { email, password, ...rest } = userData
      const payload = {
        ...rest,
        ...(password && { password }) // Include password if it's provided
      }
      const res = await apiClient.put('/api/admin/updateuser', {
        email,
        ...payload
      })
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const userActionSlice = createSlice({
  name: 'userActionSlice',
  initialState: {
    users: [],
    loading: false,
    error: null,
    res: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Handle addUsers
      .addCase(addUsers.pending, state => {
        state.res = null
        state.loading = true
        state.error = null
      })
      .addCase(addUsers.fulfilled, (state, action) => {
        state.res = action.payload
        state.loading = false
        state.error = null
        state.users.push(action.payload)
      })
      .addCase(addUsers.rejected, (state, action) => {
        state.res = null
        state.error = action.payload
        state.loading = false
        console.log(action.payload)
      })
      // Handle fetchUsers
      .addCase(fetchUsers.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users = action.payload
        state.loading = false
        state.error = null
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users = []
        state.error = action.payload
        state.loading = false
      })
      // Handle deleteUser
      .addCase(deleteUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter(user => user._id !== action.payload.id)
        state.loading = false
        state.error = null
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
      })
      // Handle updateUser
      .addCase(updateUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.res = action.payload
        state.loading = false
        state.error = null

        // Update user in state
        state.users = state.users.map(user =>
          user.email === action.payload.email ? action.payload : user
        )
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload
        state.loading = false
        console.log(action.payload, +'error occure dhere mannfu')
      })
  }
})

export default userActionSlice.reducer
