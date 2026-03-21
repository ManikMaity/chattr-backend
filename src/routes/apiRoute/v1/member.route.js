import { Router } from 'express'

import {
  getMemberDeatilsController,
  isUserPartOfWorkspaceController
} from '../../../controllers/member.controller.js'
import verifyToken from '../../../middlewares/authMiddleware.js'
import { getMemberDeatils } from '../../../validations/member.validation.js'
import validate from '../../../validations/validator.js'
const memberRouter = Router()

memberRouter.get(
  '/workspace/:workspaceId',
  verifyToken,
  isUserPartOfWorkspaceController
)
memberRouter.post(
  '/member-deatils',
  validate(getMemberDeatils),
  verifyToken,
  getMemberDeatilsController
)

export default memberRouter
