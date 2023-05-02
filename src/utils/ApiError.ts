export class ApiError extends Error {
    data?: object
    status: false

    constructor(message: string, data?: object) {
        super(message)
        this.data = data
        this.status = false
    }

    addMeta(data: object) {
        this.data = data
    }
}
