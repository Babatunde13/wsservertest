import { IOSocket } from '../types/ws.types'
import { onLogin, onLogout } from '../controllers/chat.controller'
import { ApiError } from '../utils/ApiError'

export default function userHandler (socket: IOSocket) {
    const user = socket.request.user
    if(!user) {
        socket.emit('error', new ApiError('User not found'))
        socket.disconnect()
        return
    }

    socket.on('login', () => onLogin(socket))
    socket.on('logout', () => onLogout(socket))
}
