import { type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ZodDate, date, z } from "zod";
import UserModel from "../models/User";

const createToken = (payload: string): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string);
}

//Signup validator
interface user {
    username: string;
}
const getSignupValidatedData = () => {
    return z.object(
        {
            name: z.string({ required_error: "Name is required" }),
            email: z.string({ required_error: "Email is required" }).email(),
            username: z.string({ required_error: "Username is required" }),
            password: z.string({ required_error: "Password is required" })
                .min(8, "Password must be atleast 8 characters long"),
            dateOfBirth: z.string({ required_error: "Date is required" })
        }
    );
}
export const signup = async (req: Request<{}, {}, user>, res: Response) => {
    try {
        //implement zod validation here
        const signupValidatedData = getSignupValidatedData().safeParse(req.body);
        if (!signupValidatedData.success) {
            throw { status: 403, message: signupValidatedData.error.issues.map(issue => issue.message) };
        } else {
            const { name, email, username, password, dateOfBirth } = signupValidatedData.data;
            const salt = await bcrypt.genSalt();
            const hashPassword = await bcrypt.hash(password, salt);
            console.log(dateOfBirth);
            const dob=new Date(dateOfBirth);
            const user = new UserModel({
                name,
                email,
                username,
                password: hashPassword,
                dateOfBirth: dob
            });
            const savedUser = await user.save();
            if (!savedUser) {
                throw { status: 500, message: "Could not create user" };
            }
            let token = createToken(savedUser.username);
            if (!token) {
                throw { status: 500, message: "Error while creating token" };
            }
            res.status(201).json({ accessToken: token });
        }
    } catch (err: any) {
        res
            .status(500 || err.status)
            .json({ message: err.message || "Error while creating user" });
    }
}

//Login validator

const getLoginValidatedData = () => {
    return z.object(
        {
            username: z.string({ required_error: "Username is required" }),
            password: z.string({ required_error: "Password is required" })
                .min(8, "Password should be atleast 8 characters long")
        }
    )
}
export const login = async (req: Request<{}, {}, user>, res: Response) => {
    try {
        //zod validation
        const loginValidatedData = getLoginValidatedData().safeParse(req.body);
        if (!loginValidatedData.success) {
            throw { status: 401, message: loginValidatedData.error.issues.map(issue => issue.message) };
        }
        else {
            const { username, password } = loginValidatedData.data;
            const user = await UserModel.getUserByUsername(username);
            if (!user) {
                throw { status: 401, messgage: "Invalid username" };
            }
            const isMatch: boolean = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw { status: 401, message: "Invalid password" };
            }

            let token = createToken(user.username);
            if (!token) {
                throw { status: 500, message: "Error while creating token" };
            }
            res.status(200).json({ accessToken: token });
        }

    } catch (err: any) {
        res
            .status(500 || err.status)
            .json({ message: err.message || err || "error" });
    }
}