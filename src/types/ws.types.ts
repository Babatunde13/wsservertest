import io from 'socket.io';
import { IUSer } from './user.types';

export type ICustomSocket = io.Socket & { request: io.Socket['request'] & { user: IUSer } };
