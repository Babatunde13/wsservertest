import { hashPassword } from '../utils/hash_password.utils'
import { BaseModel, ModelAPI } from './base.model.server'
import { UserClient } from './user.model.client'
import { ApiError } from '../utils/ApiError'

export interface IUser extends ModelAPI<UserClient> {}
const userModel = new BaseModel<IUser, UserClient>({
    name: 'User',
    schema: {
        name: String,
        email: {
            type: String,
            unique: true,
            required: true
        },
        username: {
            type: String,
            unique: true,
            require: true
        },
        password: String,
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user'
        }
    },
    toJSON(user) {
        return {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            username: user.username,
            role: user.role,
            created: user.created,
            updated: user.updated?.valueOf(),
            password: user.password
        }
    },
    async preSave(user) {
        const passwordResult = await hashPassword(user.password)
        if (passwordResult.error || !passwordResult.data) {
            return {error:  passwordResult.error || new ApiError('Error hashing password') }
        }

        user.password = passwordResult.data
        return { data: user }
    }
})

export default userModel
