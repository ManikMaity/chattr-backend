import { model, Schema } from 'mongoose'

const forgetPassowrdShema = new Schema(
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
    }
  },
  { timestamps: true }
)

const ForgetPasswordModel = model('ForgetPassword', forgetPassowrdShema)

export default ForgetPasswordModel
