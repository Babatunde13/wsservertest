import { randomUUID } from 'crypto';
import { Server } from 'http';
import io from 'socket.io';
import userHandler from './wsHandlers/user.handler';
import chatHandler from './wsHandlers/chat.handler';
import { ICustomSocket } from './types/ws.types';
import { CustomError } from './utils/customError';

const getUserFromToken = async (socket: ICustomSocket) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];
    return { id: "123", name: "test", token };
}

const authUserMiddleware = async (socket: io.Socket, next: (err?: any) => void) => {
    const user = await getUserFromToken((socket as ICustomSocket));
    if (!user) {
        const err = new CustomError('Unauthorized', 401);
        (err as any).data = { content: 'Please reconnect with a valid token' };
        next(err);
        return;
    }
    (socket as ICustomSocket).request.user = user;
    next();
}

const wsConnection = (socket: ICustomSocket) => {
    const id = socket.id;
    console.log('Client connected: ', id);
    console.log(socket.connected, socket.id)
    socket.join(socket.request.user.id);

    socket.on('disconnect', (reason: string) => {
        console.log('disconnect', socket.connected, socket.id)
        console.log('Client disconnected', id, reason);
    });

    socket.on('error', (err: Error) => {
        console.log('Client error', id, err);
    });

    socket.on('join:channel', (payload: any) => {
        const channel = payload.channel;
        // save channel to db for user
        socket.join(channel);
        socket.to(channel).emit('user:joined', { channel, user: socket.request.user });
    })

    userHandler(socket); 
    chatHandler(socket);
};

const createWebSocketServer = (server: Server) => {
    const wsServer = new io.Server(server, {
        allowRequest: (req, callback) => {
            const origin = req.headers.origin;
            callback(null, origin === process.env.FRONTEND_URL);
        }
    })
    wsServer.engine.generateId = () => randomUUID();
    wsServer.use(authUserMiddleware);

    wsServer.on('connection', (socket: any) => wsConnection(socket));

    return wsServer;
}

export default createWebSocketServer;
