import { type Request, type Response } from "express";
import UserModel from "../models/User";

export const getUserProfile = async (req: Request & {
    user?: {
        username: string;
    }
}, res: Response) => {
    try {
        if (!req.user)
            throw { status: 403, message: "unauthorized" };
        const existingUser = await UserModel.getUserByUsername(req.user.username);
        if (!existingUser)
            throw { status: 400, message: "user does not exist" };
        const resUser = {
            name: existingUser.name,
            email: existingUser.email,
            username: existingUser.username,
            dateOfBirth: existingUser.dateOfBirth
        }
        res.status(200).json({ user: resUser });
    } catch (err: any) {
        res.status(err.status || 400).json({ message: err.message || err });
    }
}
export const uploadProfileImage = async (req: Request &
{
    user?: {
        username: string;
    }
}, res: Response
) => {
    try {

    } catch (err: any) {
        res.status(err.status || 500).json({ message: err.message });
    }
}