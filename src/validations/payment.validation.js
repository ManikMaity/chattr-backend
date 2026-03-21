import { z } from 'zod'

export const createOrderSchema = z.object({
  amount: z.number({
    required_error: 'amount is required',
    invalid_type_error: 'amount must be a number'
  }),
  currency: z
    .string({
      required_error: 'currency is required',
      invalid_type_error: 'currency must be a string'
    })
    .default('INR')
})

export const capturePaymentValidation = z.object({
  razorpay_order_id: z.string({
    required_error: 'razorpay_order_id is required',
    invalid_type_error: 'razorpay_order_id must be a string'
  }),
  razorpay_payment_id: z.string({
    required_error: 'razorpay_payment_id is required',
    invalid_type_error: 'razorpay_payment_id must be a string'
  }),
  razorpay_signature: z.string({
    required_error: 'razorpay_signature is required',
    invalid_type_error: 'razorpay_signature must be a string'
  }),
  amount: z.number({
    required_error: 'amount is required',
    invalid_type_error: 'amount must be a number'
  })
})
