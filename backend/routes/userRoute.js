import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import { refreshTokenMiddleware } from '../middlewares/authRefreshToken.js'

import upload from '../utils/multerconfig.js'
import {
  authUser,
  updateUserProfile,
  getUserProfile,
  logoutUser,
  registerUser,
  makeAccess
} from '../controllers/userController.js'
const router = express.Router()

// router.post('/hi', (req, res) => {
//   res.status(200).json({ hey: 'done' })
// })
router.post('/access', refreshTokenMiddleware, makeAccess)
router.post('/', upload.single('image'), registerUser)
router.post('/auth', authUser)
router.post('/logout', logoutUser)
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

export default router
