import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// For logging in admin
export const loginAdmin = createAsyncThunk(
  'admin/login',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_SERVER_URL}/api/admin/login`,
        userData
      )
      const accessToken = res.data.token
      const refreshToken = res.data.refreshToken
      if (refreshToken) {
        console.log(`form admin login: ${refreshToken}`)
        localStorage.setItem('refreshToken', refreshToken)
      }
      if (accessToken) {
        console.log(`form admin login: ${accessToken}`)
        localStorage.setItem('accessToken', accessToken)
      }
      return res.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// Admin slice
const adminSlice = createSlice({
  name: 'adminSlice',
  initialState: {
    adminInfo: null,
    loading: false,
    error: null
  },
  reducers: {
    logoutAdmin: (state, action) => {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')

      state.adminInfo = null
      state.loading = false
      state.error = null
    }
  },
  extraReducers: builder => {
    builder
      .addCase(loginAdmin.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.loading = false
        state.adminInfo = action.payload
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
        console.log('admin login rejected with error:', action.payload)
      })
  }
})

export default adminSlice.reducer
export const { logoutAdmin } = adminSlice.actions
