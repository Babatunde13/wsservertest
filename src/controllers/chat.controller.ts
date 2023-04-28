import { ICustomSocket } from '../types/ws.types';

export const sendMessageToUser = async (socket: ICustomSocket, payload: any) => {
    const userChannel = `user:${payload.userId}`;
    socket.to(userChannel).emit('message', payload);
    // save message to db
};

export const sendMessageToGroupChat = async (socket: ICustomSocket, payload: any) => {
    const groupChannel = `group:${payload.groupId}`;
    socket.to(groupChannel).emit('message', payload);
    // save message to db
}

export const sendMessageToChannels = async (socket: ICustomSocket, payload: any) => {
    const channels = payload.channels;
    channels.forEach((channel: string) => {
        socket.to(channel)
    });
    socket.emit('message', payload);
    // save message to db
}
