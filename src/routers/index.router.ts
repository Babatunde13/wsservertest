import { Router } from 'express'
import { serverConfig } from './server_config.router'
import createRouteRouter from './createRoute.router'

const router = Router()

export default createRouteRouter(router, serverConfig)
