import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: [true, 'Message text is required']
    },
    simpleText: {
      type: String,
      default: null
    },
    image: {
      type: String
    },
    roomId: {
      type: String,
      default: null
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: [true, 'Channel id is required']
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Sender id is required']
    },
    workspaceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace id is required']
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Like'
      }
    ]
  },
  { timestamps: true }
)

const MessageModel = mongoose.model('Message', messageSchema)

export default MessageModel
