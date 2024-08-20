import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // Default localStorage

import adminSlice from '../slices/adminSlice'
import userSlice from '../slices/userSlice'
import userActionSlice from '../slices/userActionSlice'

const rootReducer = combineReducers({
  admin: adminSlice,
  user: userSlice,
  userActions: userActionSlice
})

// Configure persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['userActions', 'admin', 'user'] // reducers to persist
}

//creating a persified reducer
const persistedReducer = persistReducer(persistConfig, rootReducer)

//configuring stoere
const store = configureStore({
  reducer: persistedReducer
})

export const persistor = persistStore(store)
export default store
