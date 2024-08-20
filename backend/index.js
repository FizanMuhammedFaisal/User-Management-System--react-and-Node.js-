import express from 'express'
import dotenv from 'dotenv'
import userRoutes from './routes/userRoute.js'
import adminRoute from './routes/adminRoute.js'
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'
import cookieParser from 'cookie-parser'
import connectDB from './config/db.js'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Convert import.meta.url to a path
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config()
const port = process.env.PORT || 5000
const corsOptions = {
  origin: 'http://localhost:5173', // Your frontend origin
  credentials: true // Allow credentials to be sent
}
connectDB()
const app = express()
app.use(cors(corsOptions))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))
app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoute)
app.use(notFound)
app.use(errorHandler)
app.listen(port, () => {
  console.log(`Servor running on http://localhost:${port}`)
})
