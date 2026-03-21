import { StatusCodes } from 'http-status-codes'

import {
  deleteChannelService,
  getChannelByIdService,
  updateChannelService
} from '../services/channel.service.js'
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

export async function getChannelByIdController(req, res) {
  try {
    const channelId = req.params.channelId
    const userId = req.user._id
    const channel = await getChannelByIdService(channelId, userId)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('Channel fetched successfully', channel))
  } catch (err) {
    console.log(err)
    handleErrorRes(err, res)
  }
}

export async function deleteChannelController(req, res) {
  try {
    const channelId = req.params.channelId
    const userId = req.user._id
    const channel = await deleteChannelService(channelId, userId)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('Channel deleted successfully', channel))
  } catch (err) {
    console.log(err)
    handleErrorRes(err, res)
  }
}

export async function updateChannelController(req, res) {
  try {
    const channelId = req.params.channelId
    const userId = req.user._id
    const channel = await updateChannelService(channelId, userId, req.body)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('Channel updated successfully', channel))
  } catch (err) {
    console.log(err)
    handleErrorRes(err, res)
  }
}
