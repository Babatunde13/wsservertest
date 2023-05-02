import { UserClient } from 'src/models/user.model.client'
import { ApiError } from '../utils/ApiError'
import { BaseReq, BaseRes } from './base_req.ctrl.contract'

interface ClientReq {
    email: string
    password: string
}
interface ClientRes {
    user: UserClient
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
        return { error: new ApiError('Email required') }
    }

    return { data }
}