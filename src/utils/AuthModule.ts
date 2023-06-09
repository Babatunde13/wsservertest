import jwt from 'jsonwebtoken'
import { addDaysToDate } from './date.utils'
import userModel, { IUser } from '../models/user.model.server'
import envs from '../envs'
import { ONE_DAY, ONE_YEAR } from './constant'
import { ApiError } from './ApiError'

export const generateAuthTokens = async (user: IUser) => {
    try {
        const accessTokenExp = addDaysToDate(new Date(), 1)
        const refreshTokenExp = addDaysToDate(new Date(), 365)
        const accessToken = jwt.sign({ _id: user._id, role: user.role }, envs.secret, { expiresIn: '1d' })
        const refreshToken = jwt.sign({ _id: user._id, role: user.role }, envs.secret, { expiresIn: '365d' })
        return {
            data: {
                access: {
                    token: accessToken,
                    expires: accessTokenExp
                },
                refresh: {
                    token: refreshToken,
                    expires: refreshTokenExp
                }
            }
        }
    } catch(error) {
        return {
            error: new ApiError('Error generating auth tokens', (error as Error))
        }
    }
}

export const verifyAuthTokens = async (token: string) => {
    try {
        const payload = jwt.verify(token, envs.secret) as Partial<IUser>
        const userData = await userModel.findOne({ _id: payload._id })
        if (!userData.data || userData.error) {
            return { error: userData.error || new ApiError('Error fetching user data') }
        }

        return userData
    } catch(error) {
        return {
            error: new ApiError('Error verifying auth tokens', (error as Error))
        }
    }
}

export const refreshAuthTokens = async (user: IUser) => {
    try {
        const accessToken = jwt.sign({ _id: user._id, role: user.role }, envs.secret, { expiresIn: ONE_DAY })
        const refreshToken = jwt.sign({ _id: user._id, role: user.role }, envs.secret, { expiresIn: ONE_YEAR })
        return {
            data: {
                access: {
                    token: accessToken,
                    expires: addDaysToDate(new Date(), ONE_DAY)
                },
                refresh: {
                    token: refreshToken,
                    expires: addDaysToDate(new Date(), ONE_YEAR)
                }
            }
        }
    } catch(error) {
        return {
            error: new ApiError('Error generating auth tokens', (error as Error))
        }
    }
}
