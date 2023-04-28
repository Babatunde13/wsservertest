import { Request, Response } from "express";

export default async function registerController (req: Request, res: Response) {
    const { username, password, name } = req.body;
    // validate username and password
    // create jwt token
    // return jwt token
    return res.status(201).json({ message: 'Register success' });
}
