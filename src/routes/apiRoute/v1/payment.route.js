import { Router } from 'express'

import {
  capturePaymentController,
  createOrderController
} from '../../../controllers/payment.controller.js'
import verifyToken from '../../../middlewares/authMiddleware.js'
import {
  capturePaymentValidation,
  createOrderSchema
} from '../../../validations/payment.validation.js'
import validate from '../../../validations/validator.js'

const paymentRouter = Router()

paymentRouter.post(
  '/create-order',
  validate(createOrderSchema),
  verifyToken,
  createOrderController
)
paymentRouter.post(
  '/capture-payment',
  validate(capturePaymentValidation),
  verifyToken,
  capturePaymentController
)

export default paymentRouter
