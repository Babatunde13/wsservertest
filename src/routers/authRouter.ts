import { Router } from 'express'
import loginController from '../controllers/login.controller'
import registerController from '../controllers/register.controller'

const authRouter = Router()

authRouter.post('/login', loginController)
authRouter.post('/register', registerController)

export default authRouter
