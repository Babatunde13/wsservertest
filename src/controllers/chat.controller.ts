import { IOSocket, IEventPayload } from '../types/ws.types'

export const sendMessageToUser = async (socket: IOSocket, payload: IEventPayload) => {
    const userChannel = `user:${payload.userId}`
    socket.to(userChannel).emit('message', payload)
    // save message to db
}

export const sendMessageToGroupChat = async (socket: IOSocket, payload: IEventPayload) => {
    const groupChannel = `group:${payload.groupId}`
    socket.to(groupChannel).emit('message', payload)
    // save message to db
}

export const sendMessageToChannels = async (socket: IOSocket, payload: IEventPayload) => {
    const channels = payload.channels
    channels.forEach((channel: string) => {
        socket.to(channel)
    })
    socket.emit('message', payload)
    // save message to db
}
