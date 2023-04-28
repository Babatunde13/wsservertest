export class CustomError extends Error {
    data?: any;
    code?: number;
    constructor(message: string, code?: number, data?: any) {
        super(message);
        this.code = code;
        this.data = data;
    }

    addMeta(data: any) {
        this.data = data;
    }
}
