import io from 'socket.io'
import { UserClient } from '../models/user.model.client'

export type IOSocket = io.Socket & { request: io.Socket['request'] & { user: UserClient } };

export type IEventPayload<T={}> = {
    [key: string]: any;
} & T

