import ForgetPasswordModel from '../schema/forgetPassword.shema.js'
import crudRepo from './crudRepo.js'

const forgetPasswordRepo = {
  ...crudRepo(ForgetPasswordModel),
  getForgetPasswordByEmail: async function (email) {
    const forgetPassword = await ForgetPasswordModel.findOne({ email })
    return forgetPassword
  },
  getForgetPasswordByHash: async function (hash) {
    const forgetPassword = await ForgetPasswordModel.findOne({ hash })
    return forgetPassword
  }
}

export default forgetPasswordRepo
