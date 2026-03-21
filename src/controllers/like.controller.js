import { StatusCodes } from 'http-status-codes'

import {
  createLikeService,
  getMessageLikesService
} from '../services/like.service.js'
import {
  customErrorResponse,
  internalServerError
} from '../utils/customErrorResponse.js'
import { customSuccessResponse } from '../utils/successResponseObj.js'

function handleErrorRes(err, res) {
  if (err.statusCode) {
    res.status(err.statusCode).json(customErrorResponse(err))
  } else {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(internalServerError(err))
  }
}

export async function createLikeController(req, res) {
  try {
    const userId = req.user._id
    const messageId = req.params.messageId
    const { likeContent, channelId, workspaceId } = req.body
    const response = await createLikeService(
      messageId,
      likeContent,
      channelId,
      workspaceId,
      userId
    )
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('Like created successfully', response))
  } catch (err) {
    console.log(err)
    handleErrorRes(err, res)
  }
}

export async function getMessageLikesController(req, res) {
  try {
    const messageId = req.params.messageId
    const response = await getMessageLikesService(messageId)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('Likes fetched successfully', response))
  } catch (err) {
    console.log(err)
    handleErrorRes(err, res)
  }
}
