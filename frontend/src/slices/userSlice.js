import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// For registering user
export const signUpUser = createAsyncThunk(
  'user/signUp',
  async (userdata, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users`,
        userdata
      )
      const data = res.data
      // Extract the accessToken from the payload
      const accessToken = data.token
      const refreshToken = data.tokenRefresh
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      if (accessToken) {
        console.log(accessToken)
        // Store the token in localStorage
        localStorage.setItem('accessToken', accessToken)
      }
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// For logging in user
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/users/auth`,
        credentials
      )
      const data = res.data
      // Extract the accessToken from the payload
      const accessToken = data.token
      const refreshToken = data.tokenRefresh
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }
      if (accessToken) {
        // Store the token in localStorage
        localStorage.setItem('accessToken', accessToken)
        console.log(accessToken)
      }
      return data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: null,
    loading: false,
    error: null
  },
  reducers: {
    logoutUser: (state, action) => {
      state.userInfo = null
    }
  },
  extraReducers: builder => {
    // Sign Up Cases
    builder
      .addCase(signUpUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        console.log('Sign-up rejected with error:', action.payload)
      })

    // Login Cases
    builder
      .addCase(loginUser.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.userInfo = action.payload
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        console.log('Login rejected with error:', action.payload)
      })
  }
})

export default userSlice.reducer
export const { logoutUser } = userSlice.actions
