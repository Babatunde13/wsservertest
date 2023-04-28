import { ICustomSocket } from '../types/ws.types';

export const createOrder = async (socket: ICustomSocket, payload: any) => {
    console.log("Create order: ", socket.request.user, payload);
    // emit to only the user who created the order
    // create order in db
    // emit to only the user who created the order
    socket.emit('order:created', { id: "123" });
    socket.in('drivers').emit('order:created', { id: "123" })
};

export const cancelOrder = async (socket: ICustomSocket, payload: any) => {};

export const acceptOrder = async (socket: ICustomSocket, payload: any) => {};

export const declineOrder = async (socket: ICustomSocket, payload: any) => {};

export const completeOrder = async (socket: ICustomSocket, payload: any) => {};

export const rateOrder = async (socket: ICustomSocket, payload: any) => {};

export const payOrder = async (socket: ICustomSocket, payload: any) => {};
