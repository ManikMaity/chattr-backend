import { StatusCodes } from 'http-status-codes'

import {
  addChannelToWorkspaceService,
  addMemberToWorkspaceService,
  changeWorkspaceJoinCodeService,
  createWorkspaceService,
  deleteWorkspaceService,
  getAllWorspaceSerive,
  getWorkSpaceByJoinCodeService,
  getWorkspaceService,
  joinWorkspaceByCodeService,
  leaveWorkspaceService,
  makeWorkspaceMemberAdminService,
  removeMemberFromWorkspaceService,
  updateWorkspaceService
} from '../services/workspace.service.js'
import {
  customErrorResponse,
  internalServerError
} from '../utils/customErrorResponse.js'
import { customSuccessResponse } from '../utils/successResponseObj.js'

export async function createWorkspaceController(req, res) {
  try {
    const response = await createWorkspaceService({
      ...req.body,
      owner: req.user._id
    })
    res
      .status(StatusCodes.CREATED)
      .json(
        customSuccessResponse('Workspace created successfully 😃', response)
      )
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

export async function getAllWorkspaceController(req, res) {
  try {
    const userId = req.user._id
    const resposne = await getAllWorspaceSerive(userId)
    res
      .status(StatusCodes.OK)
      .json(
        customSuccessResponse('All Workspace fetched successfully', resposne)
      )
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

export async function deleteWorkspaceController(req, res) {
  try {
    const userId = req.user._id
    const workspaceId = req.params.workspaceId
    const deletedWorkspace = await deleteWorkspaceService(workspaceId, userId)
    res
      .status(StatusCodes.OK)
      .json(
        customSuccessResponse(
          'Workspace deleted successfully',
          deletedWorkspace
        )
      )
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

export async function updateWorkspaceController(req, res) {
  try {
    const userId = req.user._id
    const workspaceId = req.params.workspaceId
    const updateData = req.body
    const updatedWorkspace = await updateWorkspaceService(
      workspaceId,
      updateData,
      userId
    )
    res
      .status(StatusCodes.OK)
      .json(
        customSuccessResponse(
          'Workspace updated successfully',
          updatedWorkspace
        )
      )
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

export async function getWorkspaceController(req, res) {
  try {
    const userId = req.user._id
    const workspaceId = req.params.workspaceId
    const workspaceData = await getWorkspaceService(workspaceId, userId)
    res
      .status(StatusCodes.OK)
      .json(
        customSuccessResponse('Workspace fetched successfully', workspaceData)
      )
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

export async function getWorkSpaceByJoinCodeController(req, res) {
  try {
    const joinCode = req.params.joinCode
    const workspace = await getWorkSpaceByJoinCodeService(joinCode)
    res
      .status(StatusCodes.OK)
      .json(
        customSuccessResponse(
          'Workspace fetched successfully by join code',
          workspace
        )
      )
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

export async function addMemberToWorkspaceController(req, res) {
  try {
    const userId = req.user._id
    const { memberId, role, workspaceId, email } = req.body
    const workspace = await addMemberToWorkspaceService(
      workspaceId,
      userId,
      memberId,
      role,
      email
    )
    res
      .status(StatusCodes.OK)
      .json(
        customSuccessResponse(
          'Member added to workspace successfully',
          workspace
        )
      )
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

export async function makeWorkspaceMemberAdminController(req, res) {
  try {
    const userId = req.user._id
    const { memberId, workspaceId } = req.body
    const workspace = await makeWorkspaceMemberAdminService(
      workspaceId,
      memberId,
      userId
    )
    res
      .status(StatusCodes.OK)
      .json(
        customSuccessResponse('Member is made admin successfully', workspace)
      )
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

export async function removeMemberFromWorkspaceController(req, res) {
  try {
    const userId = req.user._id
    const { memberId, workspaceId } = req.body
    const workspace = await removeMemberFromWorkspaceService(
      workspaceId,
      memberId,
      userId
    )
    res
      .status(StatusCodes.OK)
      .json(
        customSuccessResponse(
          'Member removed from workspace successfully',
          workspace
        )
      )
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

export async function leaveWorkspaceController(req, res) {
  try {
    const userId = req.user._id
    const workspaceId = req.params.workspaceId
    const response = await leaveWorkspaceService(workspaceId, userId)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('Workspace left successfully', response))
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

export async function addChannelToWorkspaceController(req, res) {
  try {
    const userId = req.user._id
    const { channelName, workspaceId } = req.body
    const resposne = await addChannelToWorkspaceService(
      workspaceId,
      userId,
      channelName
    )
    res
      .status(StatusCodes.OK)
      .json(
        customSuccessResponse(
          `${channelName} channel added to workspace successfully`,
          resposne
        )
      )
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

export async function changeWorkspaceJoinCodeController(req, res) {
  try {
    const userId = req.user._id
    const workspaceId = req.params.workspaceId
    const workspace = await changeWorkspaceJoinCodeService(workspaceId, userId)
    res
      .status(StatusCodes.OK)
      .json(
        customSuccessResponse(
          'Workspace join code changed successfully',
          workspace
        )
      )
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

export async function joinWorkspaceByCodeController(req, res) {
  try {
    const code = req.params.joinCode
    const user = req.user
    const workspace = await joinWorkspaceByCodeService(user, code)
    res
      .status(StatusCodes.OK)
      .json(customSuccessResponse('Added in the workspace', workspace))
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
