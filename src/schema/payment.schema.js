import { model, Schema } from 'mongoose'

const paymentSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required']
    },
    orderId: {
      type: String,
      required: [true, 'Order id is required'],
      unique: [true, 'Order id must be unique']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required']
    },
    paymentId: {
      type: String,
      required: [true, 'Payment id is required'],
      unique: [true, 'Payment id must be unique']
    },
    signature: {
      type: String,
      required: [true, 'Signature is required']
    }
  },
  { timestamps: true }
)

const PaymentModel = model('Payment', paymentSchema)

export default PaymentModel
