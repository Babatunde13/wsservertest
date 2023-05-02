import { Req, Res, validationSchema } from '../contracts/login.ctrl.contract'
import userModel, { IUser } from '../models/user.model.server'
import { verifyPassword } from '../utils/hash_password.utils'
import { generateAuthTokens } from '../utils/AuthModule'
import { HttpStatusCodes } from '../contracts/base_req.ctrl.contract'

export default async function loginController (req: Req): Res {
    const validated = validationSchema(req.body)
    if (validated.error) {
        return {
            status: 'error',
            success: false,
            message: 'Invalid data',
            error: validated.error,
            code: HttpStatusCodes.BAD_REQUEST
        }
    }

    const { email, password } = validated.data
    
    const userData = await userModel.findOne({ email })
    if (userData.error || !userData.data) {
        return {
            status: 'error',
            success: false,
            message: 'Error logging in',
            error: userData.error,
            code: HttpStatusCodes.BAD_REQUEST
        }
    }
    const user = userData.data as IUser
    const verifyPasswordResult = await verifyPassword(password, user.password)
    if (verifyPasswordResult.error || !verifyPasswordResult.data) {
        return {
            status: 'error',
            success: false,
            message: 'Error logging in',
            error: verifyPasswordResult.error,
            code: HttpStatusCodes.BAD_REQUEST
        }
    }

    const tokenResult = await generateAuthTokens(user)
    if (tokenResult.error || !tokenResult.data) {
        return {
            status: 'error',
            success: false,
            message: 'Error logging in',
            error: tokenResult.error,
            code: HttpStatusCodes.BAD_REQUEST
        }
    }

    return {
        status: 'success',
        success: true,
        message: 'Login success',
        data: { user, token: tokenResult.data },
        code: HttpStatusCodes.OK
    }
}
