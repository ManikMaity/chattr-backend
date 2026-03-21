import EmailVarificationModel from '../schema/emailVarification.schema.js'
import crudRepo from './crudRepo.js'

const emailVerificationRepo = {
  ...crudRepo(EmailVarificationModel),
  getByHash: async function (hash) {
    const response = await EmailVarificationModel.findOne({ hash: hash })
    return response
  },
  getByEmail: async function (email) {
    const response = await EmailVarificationModel.findOne({ email: email })
    return response
  }
}

export default emailVerificationRepo
