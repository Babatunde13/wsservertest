import { Req, Res, validationSchema } from '../contracts/register.ctrl.contract'
import userModel, { IUser } from '../models/user.model.server'
import { generateAuthTokens } from '../utils/AuthModule'
import { HttpStatusCodes } from '../contracts/base_req.ctrl.contract'

export default async function registerController (req: Req): Res {
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

    const { username, email, password, name, role } = validated.data
    const userExists = await userModel.findOne({ $or: [{ username }, { email }] })
    if (userExists.data) {
        return {
            status: 'error',
            success: false,
            message: 'User already exists',
            code: HttpStatusCodes.BAD_REQUEST
        }
    }
    const createUserResponse = await userModel.createAndSave({ username, email, password, name, role })
    if (createUserResponse.error || !createUserResponse.data) {
        return {
            status: 'error',
            success: false,
            message: 'Error creating user account',
            error: createUserResponse.error,
            code: HttpStatusCodes.BAD_REQUEST
        }
    }
    const user = createUserResponse.data as IUser
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
        message: 'User created successfully',
        data: { user, token: tokenResult.data },
        code: HttpStatusCodes.OK
    }
}
