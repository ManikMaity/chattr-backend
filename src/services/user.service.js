import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

import transporter from '../config/mail.config.js'
import {
  ENABLE_EMAIL_VERIFICATION,
  JWT_EXPIRY,
  JWT_SECRET,
  SALT_ROUND
} from '../config/variables.js'
import { isExpired } from '../controllers/payment.controller.js'
import mailQueue from '../queues/mail.queue.js'
import emailVerificationRepo from '../repositories/emailVerification.repo.js'
import forgetPasswordRepo from '../repositories/forgetPassword.repo.js'
import paymentRepo from '../repositories/payment.repo.js'
import userRepo from '../repositories/user.repo.js'
import {
  createForgetPasswordMail,
  createUserVerificationMail
} from '../utils/common/mailObject.js'
import createPasswordHash from '../utils/createJoinCode.js'
import clientError from '../utils/errors/clientError.js'
import ValidationError from '../utils/validationError.js'

export const signupService = async (username, email, password) => {
  try {
    const user = await userRepo.create({ username, email, password })
    if (ENABLE_EMAIL_VERIFICATION) {
      const hash = createPasswordHash(8)
      await emailVerificationRepo.create({ email, hash, user: user._id })
      mailQueue.add(createUserVerificationMail(email, hash))
    }
    return user
  } catch (err) {
    console.log('user signup error', err)
    if (err.name === 'ValidationError') {
      throw new ValidationError({ error: err.errors }, err.message)
    }
    if (err.code === 11000) {
      throw new ValidationError(
        {
          error: 'A user with this email already exists'
        },
        'A user with this email already exists'
      )
    }
    throw err
  }
}

export const signinService = async (email, password) => {
  let user = await userRepo.getUserByEmail(email)
  if (!user) {
    throw new clientError({
      message: 'No registered user found with this email',
      explanation: 'User not found',
      statusCode: 404
    })
  }
  if (!bcrypt.compareSync(password, user.password)) {
    throw new clientError({
      message: 'Invailid password given',
      explanation: "Password does'nt match with the user password"
    })
  }
  const payment = await paymentRepo.findPaymentByUserId(user._id)
  if (!payment || isExpired(payment?.updatedAt, 365)) {
    user = await userRepo.update(user._id, { isSubscribed: false })
  }
  const token = jwt.sign({ id: user._id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRY
  })
  // eslint-disable-next-line no-unused-vars
  const { password: pass, ...userData } = user._doc
  return { user: userData, token }
}

export async function forgetPasswordService(email) {
  const user = await userRepo.getUserByEmail(email)

  if (!user) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'User not found with this email',
      explanation: ['User not found with this email']
    }
  }

  const hash = createPasswordHash(7)

  const forgetPassword =
    await forgetPasswordRepo.getForgetPasswordByEmail(email)
  if (forgetPassword) {
    await forgetPasswordRepo.update(forgetPassword._id, { hash })
    console.log('Forget password hash is updated')
  } else {
    await forgetPasswordRepo.create({ email, hash, user: user._id })
  }

  // eslint-disable-next-line no-unused-vars
  const respose = await transporter.sendMail(
    createForgetPasswordMail(email, hash)
  )

  return {
    message: `Email sent successfully to ${email}`
  }
}

export async function resetPasswordService(password, hash) {
  const forgetPassword = await forgetPasswordRepo.getForgetPasswordByHash(hash)

  if (!forgetPassword) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'This forget password hash is not valid',
      explanation: ['This forget password hash is not valid']
    }
  }

  const encryptedPassword = bcrypt.hashSync(password, SALT_ROUND)

  const user = await userRepo.update(forgetPassword.user, {
    password: encryptedPassword
  })

  await forgetPasswordRepo.delete(forgetPassword._id)

  return user
}

export async function verifyEmailService(hash) {
  const verificationDoc = await emailVerificationRepo.getByHash(hash)

  if (!verificationDoc) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'This verification link is not valid',
      explanation: ['This verification link is not valid']
    }
  }

  if (verificationDoc.verificationExpiry < Date.now()) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'This verification link is expired',
      explanation: ['This verification link is expired']
    }
  }

  const user = await userRepo.update(verificationDoc.user, { isVerified: true })
  await emailVerificationRepo.delete(verificationDoc._id)
  // eslint-disable-next-line no-unused-vars
  const { password, ...userData } = user._doc
  return userData
}

export async function resendVerifyEmailService(email) {
  if (!email || email.trim() === '') {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Email is required',
      explanation: ['Email is required']
    }
  }
  const user = await userRepo.getUserByEmail(email)

  if (!user) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: 'User not found with this email please signup first',
      explanation: ['User not found with this email please signup first']
    }
  }

  if (user.isVerified) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'User is already verified',
      explanation: ['User is already verified']
    }
  }

  const verifyEmailDoc = await emailVerificationRepo.getByEmail(email)
  const hash = createPasswordHash(8)

  if (verifyEmailDoc) {
    await emailVerificationRepo.update(verifyEmailDoc._id, {
      hash,
      verificationExpiry: Date.now() + 24 * 60 * 60 * 1000
    })
  } else {
    await emailVerificationRepo.create({ email, hash, user: user._id })
  }

  mailQueue.add(createUserVerificationMail(email, hash))
  return user
}

export async function updateUserProfileService(user, data) {
  if (data?.username !== user.username) {
    const userNameExit = await userRepo.getUserByUsername(data.username)
    if (userNameExit) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Username already exist',
        explanation: ['Username already exist please choose another username']
      }
    }
  }
  const updatedUser = await userRepo.update(user._id, data)
  // eslint-disable-next-line no-unused-vars
  const { password, ...userData } = updatedUser._doc
  return userData
}

export async function getUserService(id) {
  const user = await userRepo.getById(id)
  // eslint-disable-next-line no-unused-vars
  const { password, ...userData } = user._doc
  return userData
}
