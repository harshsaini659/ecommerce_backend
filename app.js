require('dotenv').config()
const connectDB = require('./config/db')
connectDB()
const cors = require('cors')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000

//Middleware
app.use(express.json())
app.use(cors())

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