import { IOSocket } from '../types/ws.types'
import {
    createOrder,
    cancelOrder,
    acceptOrder,
    declineOrder,
    completeOrder,
    rateOrder,
    payOrder,
} from '../controllers/order.controller'

export default function userHandler (socket: IOSocket) {
    const user = socket.request.user
    if(!user) {
        socket.disconnect()
        return
    }

    socket.on('order:create', (payload) => createOrder(socket, payload))
    socket.on('order:cancel', (payload) => cancelOrder(socket, payload))
    socket.on('order:accept', (payload) => acceptOrder(socket, payload))
    socket.on('order:decline', (payload) => declineOrder(socket, payload))
    socket.on('order:complete', (payload) => completeOrder(socket, payload))
    socket.on('order:rate', (payload) => rateOrder(socket, payload))
    socket.on('order:pay', (payload) => payOrder(socket, payload))
}
