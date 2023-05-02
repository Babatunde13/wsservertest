import { Request } from 'express'
import { UserClient } from '../models/user.model.client'
import { ApiError } from '../utils/ApiError'

export interface BaseReq extends Request {
    user?: UserClient
}

export type ReqWithParams<T> = BaseReq & {
    params: T
}

export enum HttpStatusCodes {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    INTERNAL_SERVER_ERROR = 500
}

export interface BaseRes<T> {
    status: 'success' | 'error'
    success: boolean
    message: string
    data?: T
    error?: ApiError
    code: HttpStatusCodes
    isMiddleware?: boolean
}
