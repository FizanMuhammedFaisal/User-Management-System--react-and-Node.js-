// multerConfig.js
import multer from 'multer'
import path from 'path'

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Specify the directory to save the uploaded files
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname)
    cb(null, file.fieldname + '-' + Date.now() + ext) // Generate a unique filename
  }
})

// File filter to accept only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  )
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error('Invalid file type. Only images are allowed'))
  }
}

const upload = multer({
  storage: storage,
  fileFilter: fileFilter
})

export default upload
