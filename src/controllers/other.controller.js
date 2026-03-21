import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'

import { getRedis } from '../config/redis.config.js'

export async function getServerHealthController(req, res) {
  const health = {
    uptime: process.uptime(),
    message: 'OK',
    timestamp: Date.now(),
    services: {}
  }

  try {
    health.services.mongodb =
      mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'

    const ping = await getRedis().ping()

    health.services.redis = ping === 'PONG' ? 'connected' : 'disconnected'

    res.status(StatusCodes.OK).json(health)
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      ...health,
      message: 'ERROR',
      error: err.message
    })
  }
}
