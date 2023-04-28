import { Request, Response, Router } from 'express';
import loginController from '../controllers/login.controller';
import registerController from '../controllers/register.controller';

const authRouter = Router();

authRouter.post('/login', (req: Request, res: Response) =>{
    const { username, password } = req.body;
    console.log("Username: ", username);
    console.log("Password: ", password);
    // validate username and password
    // create jwt token
    // return jwt token
    return res.status(200).json({ message: 'Login success' });
});
authRouter.post('/register', registerController);

export default authRouter;
