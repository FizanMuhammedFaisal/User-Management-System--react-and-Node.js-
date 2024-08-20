import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateTokens.js'
import jwt from 'jsonwebtoken'
//@ discp   login route
//route      api/admin/login
//@access    public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  console.log(req.body)
  const user = await User.findOne({ email })
  if (user && user.role !== 'admin') {
    res.status(403)
    throw new Error('Only admin can enter')
  }
  if (user && (await user.matchPassword(password))) {
    const refreshToken = generateToken(res, user._id)
    const id = user._id

    const token = jwt.sign({ id }, process.env.JWT_SECRET_ACCESS, {
      expiresIn: '15m'
    })
    res.status(200).json({
      _id: user._id,
      token,
      refreshToken
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})
//@ discp   get user route
//route      api/admin/getuser
//@access    private
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' })
  if (users) {
    res.status(200).json(users)
  } else {
    throw new Error('error finding users')
  }
})
//@ discp   logout route
//route      api/admin/logout
//@access    private
const logout = (req, res) => {
  const admin = req.user
  if (!admin) {
    throw new Error('who is loggin out')
  }
  res.cookie('jwtrefresh', '', {
    httpOnly: true,
    expires: new Date(0)
  })
  res.status(200).json({ message: ' user logged out' })
}
//@ discp   toadd new user
//route      api/admin/addUser
//@access    private
const addUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  console.log(req.body)
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400).json({ message: 'this email already exists' })
    throw new Error('User already exists')
  }
  const user = await User.create({
    name,
    email,
    password,
    message: 'user Created'
  })
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
    })
  } else {
    res.status(400)
    throw new Error('Invalid User Data')
  }
})
//@ discp   to delete user
//route      api/admin/deleteUser
//@access    private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body
  console.log(req.body, id)
  const user = await User.findOneAndDelete({ _id: id })
  console.log(user)
  if (user) {
    res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
      message: 'User deleted'
    })
  } else {
    throw new Error("could't delete user")
  }
})
//@ discp   to update user
//route      api/admin/updateUser
//@access    private
const updateUser = asyncHandler(async (req, res) => {
  const { name, email, password, prev } = req.body
  console.log('updating data' + prev + name + email + password)
  const existingUser = await User.findOne({ email })
  if (existingUser && existingUser.email !== prev.email) {
    res.status(400).json({ message: 'This email already exist' })
    throw new Error('Email is already in use')
  }
  const updatedUser = await User.findOneAndUpdate(
    { email: prev },
    { $set: { name, email, password } },
    { new: true }
  )

  if (!updatedUser) {
    console.log('error occured maybe duplicate key')
    res.status(400).json({ message: 'user already exisssss' })

    throw new Error('user not found')
  }
  res.status(200).json({ updatedUser, message: 'user updated' })
})
export { login, getUsers, logout, addUser, deleteUser, updateUser }
