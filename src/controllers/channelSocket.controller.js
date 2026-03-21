import {
  JOIN_CHANNEL,
  LEAVE_CHANNEL
} from '../utils/common/socketEventConstant.js'

export default function channelMessageHandler(socket) {
  socket.on(JOIN_CHANNEL, function joinChannel(data, cb) {
    const roomId = data.channelId
    socket.join(roomId)
    console.log('Joined channel', roomId)
    if (cb) {
      cb({
        success: true,
        message: 'Joined channel successfully',
        data: roomId
      })
    }
  })

  socket.on(LEAVE_CHANNEL, function leaveChannel(data, cb) {
    const roomId = data.channelId
    socket.leave(roomId)
    console.log('Left channel', roomId)
    if (cb) {
      cb({
        success: true,
        message: 'Left channel successfully',
        data: roomId
      })
    }
  })
}
