import LikeModel from '../schema/likes.schma.js'
import crudRepo from './crudRepo.js'

const likeRepo = {
  ...crudRepo(LikeModel),
  getAllLikesByMessageId: async function (messageId) {
    const response = await LikeModel.find({ messageId: messageId }).populate(
      'userId',
      'username email avatar'
    )
    return response
  }
}

export default likeRepo
