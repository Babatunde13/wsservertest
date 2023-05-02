import { Response } from 'express'
import { Req, validationSchema } from '../contracts/login.ctrl.contract'
import userModel, { IUser } from '../models/user.model.server'
import { verifyPassword } from '../utils/hash_password.utils'
import { generateAuthTokens } from '../utils/AuthModule'

export default async function loginController (req: Req, res: Response) {
    const validated = validationSchema(req.body)
    if (validated.error) {
        return res.status(400).json({ message: 'Invalid data', error: validated.error.data })
    }

    const { email, password } = validated.data
    
    const userData = await userModel.findOne({ email })
    if (userData.error || !userData.data) {
        return res.status(400).json({ status: false, message: 'Error logging in'})
    }
    const user = userData.data as IUser
    const verifyPasswordResult = await verifyPassword(password, user.password)
    if (verifyPasswordResult.error || !verifyPasswordResult.data) {
        return res.status(400).json({ status: false, message: 'Error logging in'})
    }

    const tokenResult = await generateAuthTokens(user)
    if (tokenResult.error || !tokenResult.data) {
        return res.status(400).json({ status: false, message: 'Error logging in'})
    }
    return res.status(200).json({ message: 'Login success', data: { user, token: tokenResult.data } })
}
