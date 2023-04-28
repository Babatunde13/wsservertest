import { ICustomSocket } from '../types/ws.types'
import {
    sendMessageToUser,
    sendMessageToGroupChat,
    sendMessageToChannels,
} from '../controllers/chat.controller'

export default function chatHandler (socket: ICustomSocket) {
    const user = socket.request.user
    console.log('User: ', user)
    if(!user) {
        socket.disconnect()
        return
    }
    socket.on('message:user', (payload) => sendMessageToUser(socket, payload))
    socket.on('message:group', (payload) => sendMessageToGroupChat(socket, payload))
    socket.on('message:channels', (payload) => sendMessageToChannels(socket, payload))
}
