import messageModel from '../models/message.model.server'
import chatModel from '../models/chat.model.server'
import { IOSocket } from '../types/ws.types'
import { ApiError } from '../utils/ApiError'
import { DeleteMessagePayload, FetchMessagesPayload, SendMessagePayload, UpdateMessagePayload } from '../contracts/send_message.ctrl.contract'

export const sendMessage = async (socket: IOSocket, payload: SendMessagePayload) => {
    const user = socket.request.user
    const channel = `chat:${payload.chat}`
    socket.to(channel).emit('message:receive', { ...payload, sender: user })
    const resp = await messageModel.createAndSave({ ...payload, sender: user._id })
    if(resp.error) {
        socket.emit('error', resp.error)
    }
}

export const deleteMessage = async (socket: IOSocket, payload: DeleteMessagePayload) => {
    const user = socket.request.user
    const message = await messageModel.findOne({ _id: payload.messageId, sender: user._id })
    if(message.error || !message.data) {
        socket.emit('error', message.error || new ApiError('Message not found'))
        return
    }
    const channel = `chat:${message.data.chat.toString()}`
    socket.to(channel).emit('message:deleted', payload)
    await messageModel.deleteOne({ _id: payload.messageId })
}

export const updateMessage = async (socket: IOSocket, payload: UpdateMessagePayload) => {
    const user = socket.request.user
    const message = await messageModel.findOne({ _id: payload.messageId, sender: user._id, chat: payload.chat })
    if(message.error || !message.data) {
        socket.emit('error', message.error || new ApiError('Message not found'))
        return
    }

    const channel = `chat:${message.data.chat.toString()}`
    socket.to(channel).emit('message:updated', payload)
    await messageModel.updateOne({ _id: payload.messageId }, { $set: payload })
}

export const fetchChats = async (socket: IOSocket) => {
    const user = socket.request.user

    const userChatResult = await  chatModel.find({ users: { $in: [user._id] }})
    if(userChatResult.error || !userChatResult.data) {
        socket.to(user._id).emit('error', userChatResult.error || new ApiError('Error fetching user chats'))
        return
    }

    const userChats = userChatResult.data
    const userChatChannels = userChats.map((chat) => `chat:${chat._id}`)
    socket.join(userChatChannels)
    socket.to(user._id).emit('chats', userChats)
}

export const fetchMessages = async (socket: IOSocket, payload: FetchMessagesPayload) => {
    const page = payload.page || 1
    const limit = payload.limit || 10
    const fetchMessagesResult = await messageModel.find({ chat: payload.chat }, { skip: (page - 1) * limit, limit })
    if(fetchMessagesResult.error || !fetchMessagesResult.data) {
        socket.emit('error', fetchMessagesResult.error || new ApiError('Error fetching messages'))
        return
    }

    const messages = fetchMessagesResult.data
    socket.to(`chat:${payload.chat}`).emit('chat:messages', messages)
}

export const onLogin = async (socket: IOSocket) => {
    const user = socket.request.user
    if(!user) {
        socket.emit('error', new ApiError('User not found'))
        return
    }
    const userChatResult = await  chatModel.find({ users: { $in: [user._id] }})
    if(userChatResult.error || !userChatResult.data) {
        socket.to(user._id).emit('error', userChatResult.error || new ApiError('Error fetching user chats'))
        return
    }

    const userChats = userChatResult.data
    const userChatChannels = userChats.map((chat) => `chat:${chat._id}`)
    socket.join(userChatChannels)
}

export const onLogout = async (socket: IOSocket) => {
    const user = socket.request.user
    if(!user) {
        socket.emit('error', new ApiError('User not found'))
        return
    }
    const userChatResult = await  chatModel.find({ users: { $in: [user._id] }})
    if(userChatResult.error || !userChatResult.data) {
        socket.to(user._id).emit('error', userChatResult.error || new ApiError('Error fetching user chats'))
        return
    }

    const userChats = userChatResult.data
    userChats.forEach((chat) => {
        const channel = `chat:${chat._id}`
        socket.to(channel).emit('user:left', { channel, user })
    })

    const userChatChannels = userChats.map((chat) => `chat:${chat._id}`)
    userChatChannels.forEach((channel) => {
        socket.leave(channel)
    })
}
