import express from 'express'

import {
  forgetPasswordController,
  getUserController,
  resendVerifyEmailController,
  resetPasswordController,
  signinController,
  signupController,
  updateUserProfileController,
  verifyEmailController
} from '../../../controllers/user.controller.js'
import verifyToken from '../../../middlewares/authMiddleware.js'
import forgetPassSchema from '../../../validations/forgetPass.validation.js'
import resetPasswordShema from '../../../validations/resetPassword.validation.js'
import signinSchema from '../../../validations/signin.validation.js'
import signupSchema from '../../../validations/signup.validation.js'
import { userProfileUpdateSchema } from '../../../validations/userProfileUpdate.validation.js'
import validate from '../../../validations/validator.js'
const userRouter = express.Router()

userRouter.get('/', verifyToken, getUserController)
userRouter.post('/signup', validate(signupSchema), signupController)
userRouter.post('/signin', validate(signinSchema), signinController)
userRouter.post(
  '/forget-password',
  validate(forgetPassSchema),
  forgetPasswordController
)
userRouter.post(
  '/reset-password',
  validate(resetPasswordShema),
  resetPasswordController
)
userRouter.get('/verifyEmail/:token', verifyEmailController)
userRouter.post('/resend-verifyEmail', resendVerifyEmailController)
userRouter.put(
  '/update-profile',
  validate(userProfileUpdateSchema),
  verifyToken,
  updateUserProfileController
)

export default userRouter
