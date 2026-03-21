import { StatusCodes } from 'http-status-codes'

import razorpayInstance from '../config/razorpay.config.js'
import { RECEIPT_SECRET } from '../config/variables.js'
import paymentRepo from '../repositories/payment.repo.js'
import { capturePaymentService } from '../services/payment.service.js'
import {
  customErrorResponse,
  internalServerError
} from '../utils/customErrorResponse.js'
import { customSuccessResponse } from '../utils/successResponseObj.js'

export function isExpired(createdAt, expiresInDays) {
  return (
    new Date(Date.now()) - new Date(createdAt) >
    24 * 60 * 60 * 1000 * expiresInDays
  )
}

export const createOrderController = async (req, res) => {
  const { amount, currency } = req.body
  try {
    const userId = req.user._id

    const paymentData = await paymentRepo.findPaymentByUserId(userId)

    if (paymentData && !isExpired(paymentData.updatedAt, 365)) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'You have already subscribed to a plan',
        explanation: ['You have already subscribed to a plan']
      }
    }

    const options = {
      amount: amount * 100,
      currency: currency || 'INR',
      receipt: RECEIPT_SECRET
    }

    const order = await razorpayInstance.orders.create(options)

    if (!order) {
      throw new Error('Order creation failed')
    }

    res
      .status(StatusCodes.CREATED)
      .json(customSuccessResponse('Order created successfully', order))
  } catch (err) {
    if (err.statusCode) {
      res.status(err.statusCode).json(customErrorResponse(err))
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalServerError(err))
    }
  }
}

export const capturePaymentController = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount
    } = req.body
    const userId = req.user._id
    await capturePaymentService(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      amount / 100,
      userId
    )
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('Payment captured successfully', {}))
  } catch (err) {
    console.log(err)
    if (err.statusCode) {
      res.status(err.statusCode).json(customErrorResponse(err))
    } else {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(internalServerError(err))
    }
  }
}
