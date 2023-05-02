import { IOSocket } from '../types/ws.types'
import { deleteMessage, sendMessage, fetchChats, fetchMessages } from '../controllers/chat.controller'
import { ApiError } from 'src/utils/ApiError'

export default function chatHandler (socket: IOSocket) {
    const user = socket.request.user
    if(!user) {
        socket.emit('error', new ApiError('User not found'))
        socket.disconnect()
        return
    }

    socket.on('send:message', (payload) => sendMessage(socket, payload))
    socket.on('delete:message', (payload) => deleteMessage(socket, payload))
    socket.on('fetch:chats', () => fetchChats(socket))
    socket.on('fetch:messages', (payload) => fetchMessages(socket, payload))
}
