import { ApiError } from '../utils/ApiError'
import { Role } from '../models/user.model.client'
import { BaseReq, BaseRes } from './base_req.ctrl.contract'

interface ClientReq {
    name: string
    email: string
    username: string
    password: string
    role: Role
}

interface ClientRes {
    user: ClientReq
    token: {
        access: {
            token: string
            expires: Date
        },
        refresh: {
            token: string
            expires: Date
        }
    }
}

export interface Req extends BaseReq {
    body: ClientReq
}

export type Res = Promise<BaseRes<ClientRes>>

export const validationSchema = (data: ClientReq) => {
    if (!data.email) {
        return { error: new ApiError('Email required') }
    }

    if (!data.password) {
        return { error: new ApiError('Password required') }
    }

    if (!data.username) {
        return { error: new ApiError('Username required') }
    }

    if (!data.role) {
        data.role = Role.User
    }

    return { data }
}