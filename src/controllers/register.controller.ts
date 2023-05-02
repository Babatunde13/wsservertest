import { Response } from 'express'
import { Req, validationSchema } from '../contracts/register.ctrl.contract'
import userModel, { IUser } from '../models/user.model.server'
import { generateAuthTokens } from '../utils/AuthModule'

export default async function registerController (req: Req, res: Response) {
    const validated = validationSchema(req.body)
    if (validated.error) {
        return res.status(400).json({ message: 'Invalid data', error: validated.error.data })
    }

    const { username, email, password, name, role } = validated.data
    const userExists = await userModel.findOne({ $or: [{ username }, { email }] })
    if (userExists.data) {
        return res.status(400).json({ message: 'User already exists' })
    }
    const createUserResponse = await userModel.createAndSave({ username, email, password, name, role })
    if (createUserResponse.error || !createUserResponse.data) {
        return res.status(400).json({ status: false, message: 'Error creating user account'})
    }
    const user = createUserResponse.data as IUser
    const tokenResult = await generateAuthTokens(user)
    if (tokenResult.error || !tokenResult.data) {
        return res.status(400).json({ status: false, message: 'Error creating user account'})
    }
    
    return res.status(201).json({ message: 'Register success', data: { user, token: tokenResult.data } })
}
