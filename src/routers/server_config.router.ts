import loginController from '../controllers/login.controller'
import registerController from '../controllers/register.controller'
import { HttpMethod, ServerConfig } from './createRoute.router'

export const serverConfig: ServerConfig[] = [
    { path: '/auth/login', handlers: [loginController], method: HttpMethod.POST },
    { path: '/auth/register', handlers: [registerController], method: HttpMethod.POST },
]
