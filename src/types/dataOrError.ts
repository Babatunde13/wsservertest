import { ApiError } from '../utils/ApiError'

export interface DataOrError<T> {
    data?: T;
    error?: ApiError
}
