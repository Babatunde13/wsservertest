import { Request, Response, NextFunction, Router } from 'express'
import loginController from '../controllers/login.controller'
import registerController from '../controllers/register.controller'

const authRouter = Router()

enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

const config = [
    { path: '/login', handlers: [loginController], method: HttpMethod.POST },
    { path: '/register', handlers: [registerController], method: HttpMethod.POST }
]

config.forEach(({ path, handlers, method }) => {
    const middlewares = handlers.map((handler) => {
        return async (req: Request, res: Response, next: NextFunction) => {
            const result = await handler(req)
            if (result.error) {
                res.status(result.code).json({ ...result, code: undefined })
            } else {
                res.status(result.code).json({ ...result, code: undefined })
            }
            if (result.isMiddleware) {
                next()
            }
        }
    })
    
    authRouter[method](path, ...middlewares)
})

export default authRouter
