import express from 'express'
import { protect } from '../middlewares/authMiddleware.js'
import admin from '../middlewares/adminCheckMiddleware.js'
const router = express.Router()
import {
  login,
  getUsers,
  logout,
  addUser,
  deleteUser,
  updateUser
} from '../controllers/adminController.js'
router.post('/login', login)
router.get('/getusers', protect, admin, getUsers)
router.post('/adduser', protect, admin, addUser)
router.post('/logout', logout)
router.put('/updateuser', protect, admin, updateUser)
router.post('/deleteuser', protect, admin, deleteUser)
export default router
