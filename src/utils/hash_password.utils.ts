import bcrypt from 'bcrypt'
import { DataOrError } from '../types/dataOrError'
import { ApiError } from './ApiError'

export const hashPassword = async (password: string): Promise<DataOrError<string>> => {
    try {
        const hash = await bcrypt.hash(password, 10)
        return { data: hash }
    } catch (error) {
        return { error: new ApiError('Error hashing password', (error as Error)) }
    }
}

export const verifyPassword = async (password: string, hash: string): Promise<DataOrError<boolean>> => {
    try {
        const isValid = await bcrypt.compare(password, hash)
        return { data: isValid }
    } catch (error) {
        return { error: new ApiError('Error verifying password', (error as Error)) }
    }
}
