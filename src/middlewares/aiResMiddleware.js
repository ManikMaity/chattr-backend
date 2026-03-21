import { StatusCodes } from 'http-status-codes'

import {
  customErrorResponse,
  internalServerError
} from '../utils/customErrorResponse.js'

const verifyAIService = async (req, res, next) => {
  try {
    const user = req.user

    if (!user || user.isSubscribed === false) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          message: 'You are not subscribed to the service',
          explanation: 'You are not subscribed to the service'
        })
      )
    }

    const now = new Date()

    if (!user.aiResponseResetTime) {
      user.aiResponseResetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      user.aiResponseCount = 0
    }

    if (now > user.aiResponseResetTime) {
      user.aiResponseCount = 0
      user.aiResponseResetTime = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    }

    if (user.aiResponseCount >= 10) {
      return res.status(StatusCodes.TOO_MANY_REQUESTS).json(
        customErrorResponse({
          message: 'Daily AI limit reached',
          explanation: 'You have reached your daily limit of 10 AI requests'
        })
      )
    }

    user.aiResponseCount += 1
    await user.save()

    next()
  } catch (err) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalServerError(err))
  }
}

export default verifyAIService
