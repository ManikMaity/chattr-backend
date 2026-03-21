import { CLIENT_URL, MAIL_ID } from '../../config/variables.js'

export const mailObject = {
  from: MAIL_ID
}

export const createJoinWorkspaceMail = (workspaceName, to) => {
  return {
    from: MAIL_ID,
    to: to,
    subject: 'You have been added to a workspace',
    text: `Congratulations! You have been added to a workspace ${workspaceName}.`
  }
}

export const createForgetPasswordMail = (to, token) => {
  return {
    from: MAIL_ID,
    to: to,
    subject: 'Reset Password',
    text: `Click on this link to reset your password ${CLIENT_URL}/reset-password/${token}`
  }
}

export const createUserVerificationMail = (to, token) => {
  return {
    from: MAIL_ID,
    to: to,
    subject: 'Verify your email',
    text: `Click on this link to verify your email ${CLIENT_URL}/verifyemail/${token}`
  }
}
