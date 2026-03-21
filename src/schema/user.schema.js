import bcrypt from 'bcrypt'
import mongoose, { Schema } from 'mongoose'

import { SALT_ROUND } from '../config/variables.js'

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: [true, 'username is required'],
      unique: [true, 'username must be unique'],
      match: [
        /^[a-zA-Z0-9]+$/,
        'Username must contain only latters and numbers'
      ]
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: [true, 'email must be unique'],

      match: [
        // eslint-disable-next-line no-useless-escape
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please fill a valid email address'
      ]
    },
    aiResponseCount: {
      type: Number,
      default: 0
    },
    aiResponseResetTime: {
      type: Date,
      default: null
    },
    password: {
      type: String,
      required: [true, 'password is required']
    },
    avatar: {
      type: String
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    isSubscribed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

userSchema.pre('save', function (next) {
  const user = this
  if (!user.isModified('password')) return next()
  const hashedPassword = bcrypt.hashSync(user.password, SALT_ROUND)
  user.password = hashedPassword
  user.avatar = `https://robohash.org/${user.username}`
  next()
})

const UserModel = mongoose.model('User', userSchema)

export default UserModel
