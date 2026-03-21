import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter.js'
import { ExpressAdapter } from '@bull-board/express'

import mailQueue from '../queues/mail.queue.js'

const serverAdapter = new ExpressAdapter()
serverAdapter.setBasePath('/admin/queues')

createBullBoard({
  queues: [new BullAdapter(mailQueue)],
  serverAdapter: serverAdapter
})

export default serverAdapter
