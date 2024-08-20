import asyncHandler from 'express-async-handler'
import User from '../models/userModel.js'
import generateToken from '../utils/generateTokens.js'
import multer from 'multer'
import jwt from 'jsonwebtoken'

// @desc    auth users/set token
// route     POST/api/user/auth
//@access   public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  console.log(password, email)
  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    const tokenRefresh = generateToken(res, user._id)
    const id = user._id

    const token = jwt.sign({ id }, process.env.JWT_SECRET_ACCESS, {
      expiresIn: '15m'
      // expiresIn: '10s'
    })
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
      tokenRefresh
    })
  } else {
    res.status(401)
    throw new Error('Invalid email or password')
  }
})

// @desc    register a new user
// route     POST/api/users/
//@access   public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, rp } = req.body
  const image = req.file
  console.log('on register route')
  console.log(req.body, email, password, image)
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  const user = await User.create({
    name,
    email,
    password,
    image: image ? image.path : null
  })

  if (user) {
    const tokenRefresh = generateToken(res, user._id)
    const id = user._id

    const token = jwt.sign({ id }, process.env.JWT_SECRET_ACCESS, {
      expiresIn: '15m'
      // expiresIn: '10s'
    })

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
      tokenRefresh
    })
  } else {
    res.status(400)
    throw new Error('Invalid User Data')
  }
})

// @desc    Logout user
// route     POST/api/users/logout
//@access   public
const logoutUser = asyncHandler((req, res) => {
  res.status(200).json({ message: ' user logged out' })
})

// @desc    get user profile
// route     GET/api/users/profile
//@access   private
const getUserProfile = (req, res) => {
  console.log(req.user)
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    image: req.user.image
  }
  res.status(200).json(user)
}
// @desc    update user profile
// route     GET/api/users/profile
//@access   private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    user.name = req.body.name || user.name
    user.email = req.body.email || user.email
    if (req.body.password) {
      user.password = req.body.password
    }
    const updatedUser = await user.save()
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email
    })
  } else {
    res.status(404)
    throw new Error('User not found')
  }
})

// @desc    for checking token
// route     GET/api/users/access
//@access   private
const makeAccess = (req, res) => {
  const user = req.user
  console.log(user)
  const id = user._id
  // Generate a new access token
  const token = jwt.sign({ id }, process.env.JWT_SECRET_ACCESS, {
    expiresIn: '15m'
    // expiresIn: '5s'
  })
  console.log(token)
  res.json({ token })
}

export {
  authUser,
  updateUserProfile,
  getUserProfile,
  logoutUser,
  registerUser,
  makeAccess
}
