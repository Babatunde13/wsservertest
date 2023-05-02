import { ApiError } from '../utils/ApiError'
import { BaseReq } from './base_req.ctrl.contract'

interface ClientReq {
    email: string
    password: string
}

export interface Req extends BaseReq {
    body: ClientReq
}

export const validationSchema = (data: ClientReq) => {
    if (!data.email) {
        return { error: new ApiError('Email required') }
    }

    if (!data.password) {
        return { error: new ApiError('Email required') }
    }

    return { data }
}