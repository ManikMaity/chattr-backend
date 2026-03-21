import cors from 'cors'
import express from 'express'
import { createServer } from 'http'
import statusCodes from 'http-status-codes'
import { Server } from 'socket.io'

import serverAdapter from './config/bullBorad.config.js'
import connectDB from './config/db.config.js'
import { connectRedis } from './config/redis.config.js'
// eslint-disable-next-line no-unused-vars
import { CLIENT_URL, PORT } from './config/variables.js'
import channelMessageHandler from './controllers/channelSocket.controller.js'
import { messageHandler } from './controllers/messageSocket.controller.js'
import apiRouter from './routes/apiRoute/api.route.js'

const app = express()
app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true
  })
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url)
  next()
})

const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
    credentials: true
  }
})

io.on('connection', (socket) => {
  messageHandler(io, socket)
  channelMessageHandler(socket, io)
})

app.use('/admin/queues', serverAdapter.getRouter())
app.get('/ping', (req, res) => {
  res.status(statusCodes.OK).json({
    success: true,
    message: 'pong'
  })
})
app.use('/api', apiRouter)

async function startServer() {
  try {
    await connectRedis()
    await connectDB()

    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`)
    })
  } catch (err) {
    console.error('Failed to start server:', err)
    process.exit(1)
  }
}

startServer()
