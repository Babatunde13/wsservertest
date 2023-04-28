import { ICustomSocket, IEventPayload } from '../types/ws.types'

export const createOrder = async (socket: ICustomSocket, payload: IEventPayload) => {
    console.log('Create order: ', socket.request.user, payload)
    // emit to only the user who created the order
    // create order in db
    // emit to only the user who created the order
    socket.to(socket.request.user.id).emit('order:created', { id: '123' })
    socket.in('drivers').emit('order:created', { id: '123' })
}

export const cancelOrder = async (socket: ICustomSocket, payload: IEventPayload) => {
    console.log('Cancel order: ', socket.request.user, payload)
    // emit to only the user who created the order
    // cancel order in db
    // emit to only the user who created the order
    socket.to(socket.request.user.id).emit('order:cancelled', { id: '123' })
}

export const acceptOrder = async (socket: ICustomSocket, payload: IEventPayload) => {
    console.log('Accept order: ', socket.request.user, payload)
    // emit to only the user who created the order
    // accept order in db
    // emit to only the user who created the order
    socket.to(socket.request.user.id).emit('order:accepted', { id: '123' })
}

export const declineOrder = async (socket: ICustomSocket, payload: IEventPayload) => {
    console.log('Decline order: ', socket.request.user, payload)
    // emit to only the user who created the order
    // decline order in db
    // emit to only the user who created the order
    socket.to(socket.request.user.id).emit('order:declined', { id: '123' })
}

export const completeOrder = async (socket: ICustomSocket, payload: IEventPayload) => {
    console.log('Complete order: ', socket.request.user, payload)
    // emit to only the user who created the order
    // complete order in db
    // emit to only the user who created the order
    socket.to(socket.request.user.id).emit('order:completed', { id: '123' })
}

export const rateOrder = async (socket: ICustomSocket, payload: IEventPayload) => {
    console.log('Rate order: ', socket.request.user, payload)
    // emit to only the user who created the order
    // rate order in db
    // emit to only the user who created the order
    socket.to(socket.request.user.id).emit('order:rated', { id: '123' })
}

export const payOrder = async (socket: ICustomSocket, payload: IEventPayload) => {
    console.log('Pay order: ', socket.request.user, payload)
    // emit to only the user who created the order
    // pay order in db
    // emit to only the user who created the order
    socket.to(socket.request.user.id).emit('order:paid', { id: '123' })
}
