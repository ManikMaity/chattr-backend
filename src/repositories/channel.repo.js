import ChannelModel from '../schema/channel.schema.js'
import crudRepo from './crudRepo.js'

const channelRepo = {
  ...crudRepo(ChannelModel),
  getChannelByIdWithWorkspace: async function (channelId) {
    const channel =
      await ChannelModel.findById(channelId).populate('workspaceId')
    return channel
  },
  deleteChannelWithWorkspace: async function (channelId) {
    const channel =
      await ChannelModel.findByIdAndDelete(channelId).populate('workspaceId')
    return channel
  }
}

export default channelRepo
