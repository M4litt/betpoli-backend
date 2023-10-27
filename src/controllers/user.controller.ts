import { Request, Response } from "express";
import { userModel } from "../models/user.model";

export default {
    placeholder: (req: Request, res: Response) => {
        res.status(200).send('Response from user.controller')
    }
}