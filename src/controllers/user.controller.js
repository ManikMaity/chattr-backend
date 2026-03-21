import { StatusCodes } from 'http-status-codes'

import {
  forgetPasswordService,
  getUserService,
  resendVerifyEmailService,
  resetPasswordService,
  signinService,
  signupService,
  updateUserProfileService,
  verifyEmailService
} from '../services/user.service.js'
import {
  customErrorResponse,
  internalServerError
} from '../utils/customErrorResponse.js'
import { customSuccessResponse } from '../utils/successResponseObj.js'

export const getUserController = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await getUserService(userId)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('User fetched successfully', user))
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

export const signupController = async (req, res) => {
  try {
    const { username, email, password } = req.body
    const user = await signupService(username, email, password)
    res
      .status(StatusCodes.CREATED)
      .json(customSuccessResponse('User created successfully', user))
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

export const signinController = async (req, res) => {
  try {
    const { email, password } = req.body
    const data = await signinService(email, password)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('User signed in successfully', data))
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

export const forgetPasswordController = async (req, res) => {
  try {
    const { email } = req.body
    const response = await forgetPasswordService(email)
    res
      .status(StatusCodes.OK)
      .json(
        customSuccessResponse('Password reset link sent successfully', response)
      )
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

export const resetPasswordController = async (req, res) => {
  try {
    const { hash, password } = req.body
    const response = await resetPasswordService(password, hash)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('Password reset successfully', response))
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

export const verifyEmailController = async (req, res) => {
  try {
    const token = req.params.token
    const response = await verifyEmailService(token)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('Email verified successfully', response))
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

export const resendVerifyEmailController = async (req, res) => {
  try {
    const email = req.body.email
    await resendVerifyEmailService(email)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('verification link resend successfully', {}))
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

export const updateUserProfileController = async (req, res) => {
  try {
    const user = req.user
    const { avatar, username } = req.body
    if (!avatar && !username) {
      throw {
        statusCode: StatusCodes.BAD_REQUEST,
        message: 'Please provide avatar or username to update profile',
        explanation: ['Please provide avatar or username to update profile']
      }
    }
    const updatedUser = await updateUserProfileService(user, req.body)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('Profile updated successfully', updatedUser))
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
