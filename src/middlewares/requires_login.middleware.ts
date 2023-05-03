import { ApiError } from '../utils/ApiError'
import { BaseReq, BaseRes, HttpStatusCodes } from '../contracts/base_req.ctrl.contract'
import { verifyAuthTokens } from '../utils/AuthModule'

const getTokenFromReq = (req: BaseReq): BaseRes<string> => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return {
            error: new ApiError('Authorization header required'),
            code: HttpStatusCodes.UNAUTHORIZED,
            message: 'Unauthorized',
            status: 'error',
            success: false
        }
    }

    const token = authHeader.split(' ')[1]
    if (!token) {
        return {
            error: new ApiError('Token required'),
            code: HttpStatusCodes.UNAUTHORIZED,
            message: 'Unauthorized',
            status: 'error',
            success: false
        }
    }

    return {
        data: token,
        code: HttpStatusCodes.OK,
        message: 'OK',
        status: 'success',
        success: true
    }
}

export default async function requiresLogin(req: BaseReq): Promise<BaseRes<string>> {
    const tokenResult = getTokenFromReq(req)
    if (tokenResult.error || !tokenResult.data) {
        return tokenResult
    }

    const token = tokenResult.data
    const userResponse = await verifyAuthTokens(token)
    if (userResponse.error || !userResponse.data) {
        return {
            status: 'error',
            success: false,
            message: 'Unauthorized',
            error: userResponse.error,
            code: HttpStatusCodes.UNAUTHORIZED
        }
    }

    const user = userResponse.data
    req.user = user

    return {
        status: 'success',
        success: true,
        message: 'OK',
        data: token,
        code: HttpStatusCodes.OK,
        isMiddleware: true
    }
}
