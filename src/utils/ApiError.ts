export class ApiError extends Error {
    data?: object
    code?: number
    status: false

    constructor(message: string, code?: number, data?: object) {
        super(message)
        this.code = code
        this.data = data
        this.status = false
    }

    addMeta(data: object) {
        this.data = data
    }
}
