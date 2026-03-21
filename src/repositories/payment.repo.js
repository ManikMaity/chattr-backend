import PaymentModel from '../schema/payment.schema.js'
import crudRepo from './crudRepo.js'

const paymentRepo = {
  ...crudRepo(PaymentModel),
  findPaymentByUserId: async (userId) => {
    const response = await PaymentModel.findOne({ userId })
    return response
  }
}

export default paymentRepo
