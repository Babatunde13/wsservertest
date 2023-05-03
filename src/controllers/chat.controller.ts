import messageModel from '../models/message.model.server'
import chatModel from '../models/chat.model.server'
import { IOSocket } from '../types/ws.types'
import { ApiError } from '../utils/ApiError'
import {
    CreateChatPayload, DeleteMessagePayload, FetchMessagesPayload,
    ReadMessagePayload, SendMessagePayload, UpdateMessagePayload
} from '../contracts/chats.ctrl.contract'

export const createChat = async (socket: IOSocket, payload: CreateChatPayload) => {
    const user = socket.request.user
    const { name, picture, isGroup, users } = payload
    const chatUsers = new Set(users)
    chatUsers.add(user._id)

    const createChatResponse = await chatModel.createAndSave({
        name, picture, isGroup, users: Array.from(chatUsers), owner: user._id
    })
    if (createChatResponse.error || !createChatResponse.data) {
        socket.to(user._id).emit('error', createChatResponse.error || new ApiError('Error creating chat'))
        return
    }
    const chat = createChatResponse.data
    for (const userId of Array.from(chatUsers)) {
        if (userId !== user._id) {
            socket.to(userId).emit('chat:created', { chat })
        }
    }
}

export const sendMessage = async (socket: IOSocket, payload: SendMessagePayload) => {
    const user = socket.request.user
    const channel = `chat:${payload.chat}`
    socket.to(channel).emit('message:receive', { ...payload, sender: user })
    const resp = await messageModel.createAndSave({ ...payload, sender: user._id })
    if(resp.error) {
        socket.to(user._id).emit('error', resp.error)
    }
}

export const deleteMessage = async (socket: IOSocket, payload: DeleteMessagePayload) => {
    const user = socket.request.user
    const message = await messageModel.findOne({ _id: payload.messageId, sender: user._id })
    if(message.error || !message.data) {
        socket.to(user._id).emit('error', message.error || new ApiError('Message not found'))
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
        socket.to(user._id).emit('error', message.error || new ApiError('Message not found'))
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
    const user = socket.request.user
    const page = payload.page || 1
    const limit = payload.limit || 10
    const fetchMessagesResult = await messageModel.find({ chat: payload.chat }, { skip: (page - 1) * limit, limit })
    if(fetchMessagesResult.error || !fetchMessagesResult.data) {
        socket.to(user._id).emit('error', fetchMessagesResult.error || new ApiError('Error fetching messages'))
        return
    }

    const messages = fetchMessagesResult.data
    socket.to(`chat:${payload.chat}`).emit('chat:messages', messages)
}

export const onLogin = async (socket: IOSocket) => {
    const user = socket.request.user
    const userChatResult = await  chatModel.find({ users: { $in: [user._id] }})
    if(userChatResult.error || !userChatResult.data) {
        socket.to(user._id).to(user._id).emit('error', userChatResult.error || new ApiError('Error fetching user chats'))
        return
    }

    const userChats = userChatResult.data
    const userChatChannels = userChats.map((chat) => `chat:${chat._id}`)
    socket.join(userChatChannels)
}

export const onLogout = async (socket: IOSocket) => {
    const user = socket.request.user
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

export const readMessage = async (socket: IOSocket, payload: ReadMessagePayload) => {
    const user = socket.request.user
    const message = await messageModel.findOne({ _id: payload.messageId, chat: payload.chat })
    if(message.error || !message.data) {
        socket.to(user._id).emit('error', message.error || new ApiError('Message not found'))
        return
    }

    const channel = `chat:${message.data.chat.toString()}`
    socket.to(channel).emit('message:read', payload)

    await messageModel.updateOne({ _id: payload.messageId, chat: payload.chat }, { $set: { status: 'read' } })
}

export const deliverMessage = async (socket: IOSocket, payload: ReadMessagePayload) => {
    const user = socket.request.user
    const message = await messageModel.findOne({ _id: payload.messageId, chat: payload.chat })
    if(message.error || !message.data) {
        socket.to(user._id).emit('error', message.error || new ApiError('Message not found'))
        return
    }

    const channel = `chat:${message.data.chat.toString()}`
    socket.to(channel).emit('message:delivered', payload)
    
    await messageModel.updateOne({ _id: payload.messageId, chat: payload.chat }, { $set: { status: 'delivered' } })
}
