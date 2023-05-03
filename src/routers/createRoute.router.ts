import { Request, Response, NextFunction, Router } from 'express'
import { BaseReq, BaseRes } from '../contracts/base_req.ctrl.contract'

export default (router: Router, config: ServerConfig[]) => {
    config.forEach(({ path, handlers, method }) => {
        const middlewares = handlers.map((handler) => {
            return async (req: Request, res: Response, next: NextFunction) => {
                const result = await handler(req)
                if (result.error) {
                    res.status(result.code).json({ ...result, code: undefined })
                } else if (result.isMiddleware) {
                    next()
                } else {
                    res.status(result.code).json({ ...result, code: undefined })
                }
            }
        })
        
        router[method](path, ...middlewares)
    })

    return router
}

export enum HttpMethod {
    GET = 'get',
    POST = 'post',
    PUT = 'put',
    DELETE = 'delete'
}

export type Handler<T> = (req: BaseReq) => Promise<BaseRes<T>>

export interface ServerConfig {
    path: string
    handlers: Handler<any>[]
    method: HttpMethod
}
