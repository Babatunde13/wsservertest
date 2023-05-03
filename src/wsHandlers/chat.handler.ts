import { IOSocket } from '../types/ws.types'
import { deleteMessage, sendMessage, fetchChats, fetchMessages, readMessage, deliverMessage, updateMessage } from '../controllers/chat.controller'
import { ApiError } from '../utils/ApiError'

export default function chatHandler (socket: IOSocket) {
    const user = socket.request.user
    if(!user) {
        socket.emit('error', new ApiError('User not found'))
        socket.disconnect()
        return
    }

    socket.on('send:message', (payload) => sendMessage(socket, payload))
    socket.on('delete:message', (payload) => deleteMessage(socket, payload))
    socket.on('update:message', (payload) => updateMessage(socket, payload))
    socket.on('fetch:chats', () => fetchChats(socket))
    socket.on('fetch:messages', (payload) => fetchMessages(socket, payload))
    socket.on('read:message', (payload) => readMessage(socket, payload))
    socket.on('deliver:message', (payload) => deliverMessage(socket, payload))
}
