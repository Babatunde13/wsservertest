import messageModel from '../models/message.model.server'
import chatModel from '../models/chat.model.server'
import { IOSocket } from '../types/ws.types'
import {
    CreateChatPayload, DeleteMessagePayload, FetchMessagesPayload,
    ReadMessagePayload, SendMessagePayload, UpdateMessagePayload
} from '../contracts/chats.ctrl.contract'

export const createChat = async (socket: IOSocket, payload: CreateChatPayload) => {
    const user = socket.request.user
    const { name, picture, isGroup, users } = payload
    const chatUsers = new Set(users)
    chatUsers.add(user._id.toString())
    // check that the personal chat doesn't exist
    if (chatUsers.size === 2 && !isGroup) {
        const personalChatResponse = await chatModel.findOne({
            isGroup: false,
            users: {
                $in: Array.from(chatUsers)
            }
        })
        if (personalChatResponse.error) {
            socket.emit('error', { message: 'Error checking personal chat', code: 500 })
            return
        }
        if (personalChatResponse.data) {
            socket.emit('error', { message: 'Personal chat already exists, send the message there', code: 400, chat: personalChatResponse.data, channel: `chat:${personalChatResponse.data._id}` })
            return
        }
    }

    const createChatResponse = await chatModel.createAndSave({
        name, picture,
        isGroup: chatUsers.size > 2 || isGroup,
        users: Array.from(chatUsers), owner: user._id
    })
    if (createChatResponse.error || !createChatResponse.data) {
        socket.emit('error', { message: 'Error creating chat', code: 500 })
        return
    }
    const chat = createChatResponse.data
    for (const userId of Array.from(chatUsers)) {
        if (userId !== user._id.toString()) {
            socket.to(userId.toString()).emit('chat:created', { chat, channel: `chat:${chat._id.toString()}` })
        } else {
            socket.join(`chat:${chat._id.toString()}`)
        }
    }
}

export const sendMessage = async (socket: IOSocket, payload: SendMessagePayload) => {
    const user = socket.request.user
    const channel = `chat:${payload.chat}`
    const resp = await messageModel.createAndSave({ ...payload, sender: user._id })
    if(resp.error) {
        socket.emit('error', { message: 'Error sending message', code: 500 })
    }

    socket.to(channel).emit('message:receive', { message: resp.data, channel })
    socket.emit('message:sent', { message: resp.data, channel })
}

export const deleteMessage = async (socket: IOSocket, payload: DeleteMessagePayload) => {
    const user = socket.request.user
    const message = await messageModel.findOne({ _id: payload.messageId, sender: user._id })
    if(message.error || !message.data) {
        socket.emit('error', { message: 'Message not found', code: 404})
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
        socket.emit('error', { message: 'Message not found', code: 404})
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
        socket.emit('error', { message: 'Error fetching chats', code: 500 })
        return
    }

    const userChats = userChatResult.data
    const userChatChannels = userChats.map((chat) => `chat:${chat._id}`)
    socket.join(userChatChannels)
    socket.to(user._id.toString()).emit('chats', userChats)
}

export const fetchMessages = async (socket: IOSocket, payload: FetchMessagesPayload) => {
    const page = payload.page || 1
    const limit = payload.limit || 10
    const fetchMessagesResult = await messageModel.find({ chat: payload.chat }, { skip: (page - 1) * limit, limit })
    if(fetchMessagesResult.error || !fetchMessagesResult.data) {
        socket.emit('error', { message: 'Error fetching messages', code: 500 })
        return
    }

    const messages = fetchMessagesResult.data
    socket.to(`chat:${payload.chat}`).emit('chat:messages', messages)
}

export const onLogin = async (socket: IOSocket) => {
    const user = socket.request.user
    const userChatResult = await  chatModel.find({ users: { $in: [user._id] }})
    if(userChatResult.error || !userChatResult.data) {
        socket.emit('error', { message: 'Error fetching user chats', code: 500 })
        return
    }

    const userChats = userChatResult.data
    const userChatChannels = userChats.map((chat) => `chat:${chat._id.toString()}`)
    socket.join(userChatChannels)
}

export const onLogout = async (socket: IOSocket) => {
    const user = socket.request.user
    const userChatResult = await  chatModel.find({ users: { $in: [user._id] }})
    if(userChatResult.error || !userChatResult.data) {
        socket.emit('error', { message: 'Error fetching user chats', code: 500 })
        return
    }

    const userChats = userChatResult.data
    userChats.forEach((chat) => {
        const channel = `chat:${chat._id.toString()}`
        socket.to(channel).emit('user:left', { channel, user })
    })

    const userChatChannels = userChats.map((chat) => `chat:${chat._id.toString()}`)
    userChatChannels.forEach((channel) => {
        socket.leave(channel)
    })
}

export const readMessage = async (socket: IOSocket, payload: ReadMessagePayload) => {
    const message = await messageModel.findOne({ _id: payload.messageId, chat: payload.chat })
    if(message.error || !message.data) {
        socket.emit('error', { message: 'Message not found', code: 404})
        return
    }

    const channel = `chat:${message.data.chat.toString()}`
    socket.to(channel).emit('message:read', payload)

    await messageModel.updateOne({ _id: payload.messageId, chat: payload.chat }, { $set: { status: 'read' } })
}

export const deliverMessage = async (socket: IOSocket, payload: ReadMessagePayload) => {
    const message = await messageModel.findOne({ _id: payload.messageId, chat: payload.chat })
    if(message.error || !message.data) {
        socket.emit('error', { message: 'Message not found', code: 404})
        return
    }

    const channel = `chat:${message.data.chat.toString()}`
    socket.to(channel).emit('message:delivered', payload)
    
    await messageModel.updateOne({ _id: payload.messageId, chat: payload.chat }, { $set: { status: 'delivered' } })
}
