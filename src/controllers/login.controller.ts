import { Request, Response } from "express";

export default async function loginController (req: Request, res: Response) {
    const { username, password } = req.body;
    console.log("Username: ", username);
    console.log("Password: ", password);
    // validate username and password
    // create jwt token
    // return jwt token
    return res.status(200).json({ message: 'Login success' });
}
