import { Request } from 'express'
import { UserClient } from '../models/user.model.client'

export interface BaseReq extends Request {
    user?: UserClient
}

export type ReqWithParams<T> = BaseReq & {
    params: T
}