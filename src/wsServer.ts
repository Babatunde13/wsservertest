import { randomUUID } from 'crypto'
import { Server } from 'http'
import io from 'socket.io'
import userHandler from './wsHandlers/user.handler'
import chatHandler from './wsHandlers/chat.handler'
import { IOSocket, IEventPayload } from './types/ws.types'
import { ApiError } from './utils/ApiError'
import { verifyAuthTokens } from './utils/AuthModule'

const getUserFromToken = async (socket: IOSocket) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1]
    const userData = await verifyAuthTokens(token)
    if (!userData.data || userData.error) {
        return { error: userData.error || new ApiError('Error fetching user data', 400) }
    }
    return userData
}

const authUserMiddleware = async (socket: io.Socket, next: (err?: ApiError) => void) => {
    const userData = await getUserFromToken((socket as IOSocket))
    if (!userData.data || userData.error) {
        const err = new ApiError('Unauthorized', 401)
        err.addMeta({ content: 'Please reconnect with a valid token' })
        next(err)
        return
    }
    (socket as IOSocket).request.user = userData.data
    next()
}

const wsConnection = (socket: IOSocket) => {
    const id = socket.id
    console.log('Client connected: ', id)
    console.log(socket.connected, socket.id)
    socket.join(socket.request.user._id)

    socket.on('disconnect', (reason: string) => {
        console.log('disconnect', socket.connected, socket.id)
        console.log('Client disconnected', id, reason)
    })

    socket.on('error', (err: Error) => {
        console.log('Client error', id, err)
    })

    socket.on('join:channel', (payload: IEventPayload) => {
        const channel: string = payload.channel
        // save channel to db for user
        socket.join(channel)
        socket.to(channel).emit('user:joined', { channel, user: socket.request.user })
    })

    userHandler(socket) 
    chatHandler(socket)
}

const createWebSocketServer = (server: Server) => {
    const wsServer = new io.Server(server, {
        allowRequest: (req, callback) => {
            const origin = req.headers.origin
            callback(null, origin === process.env.FRONTEND_URL)
        }
    })
    wsServer.engine.generateId = () => randomUUID()
    wsServer.use(authUserMiddleware)

    wsServer.on('connection', (socket: any) => wsConnection(socket))

    return wsServer
}

export default createWebSocketServer
