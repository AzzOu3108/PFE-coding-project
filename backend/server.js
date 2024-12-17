require('dotenv').config
const express = require('express')
const app = express()
const path = require('path')
const {logger} = require('./middleware/logger')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 8000

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.listen(PORT, ()=> console.log(`Server running in port ${PORT}`))