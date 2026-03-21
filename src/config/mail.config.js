import nodemailer from 'nodemailer'

import { MAIL_ID, MAIL_PASSWORD } from './variables.js'

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: MAIL_ID,
    pass: MAIL_PASSWORD
  }
})

export function createMailerOption(receiverEmail, subject, bodyText) {
  return {
    from: MAIL_ID,
    to: receiverEmail,
    subject: subject,
    text: bodyText
  }
}

export default transporter
