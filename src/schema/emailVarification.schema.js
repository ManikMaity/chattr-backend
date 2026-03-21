import { model, Schema } from 'mongoose'

const emailVarificationSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is required']
    },
    hash: {
      type: String,
      required: [true, 'Hash is required']
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    },
    verificationExpiry: {
      type: Date
    }
  },
  { timestamps: true }
)

emailVarificationSchema.pre('save', function (next) {
  this.verificationExpiry = Date.now() + 60 * 60 * 1000 // 1 hour
  next()
})

const EmailVarificationModel = model(
  'EmailVarification',
  emailVarificationSchema
)

export default EmailVarificationModel
