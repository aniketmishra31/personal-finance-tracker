import { type Request, type Response } from "express";
import multer from "multer";
import db from "../config/db";
import UserModel from "../models/User";
import path from "path";
import fs from "fs";
import ImageModel from "../models/Image";

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
const handleUpload = async (file: Express.Multer.File) => {
    try {
        const fileName = `${Date.now()}/${file.originalname}`
        const { data, error } = await db
            .storage
            .from("images")
            .upload(fileName, fs.readFileSync(file.path));
        if (error)
            throw error;
        if (!data)
            return undefined;
        fs.unlinkSync(file.path);
        return `${process.env.BUCKET_URL}/${data.path}`;
    } catch (err: any) {
        return err;
    }
}
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, `${path.join(__dirname, "uploads")}`)
    },
    filename: function (req, file, cb) {
        const uniqueFilename = Date.now() + '-' + file.originalname;
        cb(null, uniqueFilename)
    }
});
export const upload = multer({
    storage
});
export const addProfileImage = async (req: Request & {
    user?: {
        username: string;
    }
}, res: Response) => {
    try {
        if (!req.user)
            throw { status: 400, message: "user not found in req body" };
        const file = req.file;
        if (!file)
            throw { status: 400, message: "please upload an image" };
        if (file.mimetype.split("/")[0] !== "image")
            throw { status: 400, message: "please upload a file of type image" };
        const url = await handleUpload(file);
        if (!url)
            throw { status: 400, message: "Could not save the image" };
        const user = await UserModel.getUserByUsername(req.user.username);
        if (!user)
            throw { status: 400, message: "Could not get user details" };
        const image = new ImageModel({
            user_id: user.id,
            image_url: url,
            cover_url: ""
        });
        const saveStatus = await image.save();
        if (saveStatus !== true)
            throw { status: 400, message: "Could not save the image" };
        res.status(200).json({ status: saveStatus, url: url });
    } catch (err: any) {
        res
            .status(err.status)
            .json({ message: err.message });
    }
}