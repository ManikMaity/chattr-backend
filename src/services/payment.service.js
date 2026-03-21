import crypto from 'crypto'
import { StatusCodes } from 'http-status-codes'

import { RAZORPAY_SECRET } from '../config/variables.js'
import paymentRepo from '../repositories/payment.repo.js'
import userRepo from '../repositories/user.repo.js'

export const capturePaymentService = async (
  orderId,
  paymentId,
  signature,
  amount,
  userId
) => {
  const generated_signature = crypto
    .createHmac('sha256', RAZORPAY_SECRET)
    .update(orderId + '|' + paymentId)
    .digest('hex')
  if (generated_signature !== signature) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid signature',
      explanation: ['Invalid signature']
    }
  }

  const alreadyCaptured = await paymentRepo.findPaymentByUserId(userId)
  let paymentData
  if (alreadyCaptured) {
    paymentData = await paymentRepo.update(alreadyCaptured._id, {
      orderId,
      paymentId,
      signature,
      amount
    })
  } else {
    paymentData = await paymentRepo.create({
      orderId,
      paymentId,
      signature,
      amount,
      userId
    })
  }
  await userRepo.update(userId, { isSubscribed: true })
  return paymentData
}
