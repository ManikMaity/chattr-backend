import Redis from 'ioredis'

import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from './variables.js'

let redis = null

export const connectRedis = async () => {
  if (!redis) {
    redis = new Redis({
      host: REDIS_HOST,
      port: Number(REDIS_PORT),
      password: REDIS_PASSWORD
    })

    await redis.ping()
    console.log('Redis connected')
  }

  return redis
}

export const getRedis = () => redis
