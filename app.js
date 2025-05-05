require('dotenv').config()
const connectDB = require('./config/db')
connectDB()
const cors = require('cors')
const express = require('express')
const authRoutes = require('./src/routes/authRoutes') //Import authRoutes
const app = express()
const PORT = process.env.PORT || 3000

//Middleware
app.use(express.json())
app.use(cors())

//Use the authRoutes
app.use('/api/auth', authRoutes)

// Test Route
app.get('/', (req, res) => {
  res.json({
    status:'API is working',
    message:'Ecommerce Backend Ready'
  })
})

//Start Server
app.listen(PORT, () => {
  console.log(`Server is running on 'http://localhost:${PORT}'`)
})