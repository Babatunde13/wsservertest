import mongoose from 'mongoose'
import { ApiError } from '../utils/ApiError'

export const connectToDB = async (url: string) => {
    try {
        await mongoose.connect(url)
        console.log('Connected to DB successfully!')
        return {
            data: true
        }
    } catch(error) {
        console.log('Failed to connect to DB')
        return {
            error: new ApiError('Failed to connect to DB', (error as Error))
        }
    }
}
