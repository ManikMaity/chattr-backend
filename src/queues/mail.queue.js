import Queue from 'bull'

import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '../config/variables.js'

export default new Queue('mailQueue', {
  redis: {
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD
  }
})
