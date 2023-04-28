import io from 'socket.io'
import { IUSer } from './user.types'

export type IOSocket = io.Socket & { request: io.Socket['request'] & { user: IUSer } };

export interface IEventPayload {
    [key: string]: any;
}
