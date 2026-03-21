import { model, Schema } from 'mongoose'

const likeSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User id is required']
    },
    messageId: {
      type: Schema.Types.ObjectId,
      ref: 'Message',
      required: [true, 'Message id is required']
    },
    likeContent: {
      type: String,
      required: [true, 'Like content is required']
    },
    channelId: {
      type: Schema.Types.ObjectId,
      ref: 'Channel',
      required: [true, 'Channel id is required']
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: 'Workspace',
      required: [true, 'Workspace id is required']
    }
  },
  { timestamps: true }
)

const LikeModel = model('Like', likeSchema)

export default LikeModel
