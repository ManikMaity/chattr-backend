import transporter from '../config/mail.config.js'
import mailQueue from '../queues/mail.queue.js'

mailQueue.process(async (job) => {
  const emailData = job.data
  try {
    const respose = await transporter.sendMail(emailData)
    console.log('Email sent successfully', respose)
  } catch (err) {
    console.log('Email processing error', err)
  }
})
