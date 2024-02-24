import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";

const isAuth = (req: Request & {
    user?: {
        username: string;
    }
}, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            throw { status: 403, message: "Token not found" };
        }
        if (authHeader.startsWith("Bearer ")) {
            const token = authHeader.slice(7, authHeader.length);
            const payload = token;
            if (!process.env.JWT_SECRET) {
                throw new Error("JWT_SECRET environment variable is not defined");
            }
            const isVerified = jwt.verify(payload, process.env.JWT_SECRET as string);
            if (!isVerified) {
                throw { status: 403, message: "invalid token payload" };
            }
            const decodedToken = jwt.decode(token) as string;
            if (!decodedToken) {
                throw { status: 403, message: "invalid token payload" };
            }
            req.user = {
                username: decodedToken
            };
            next();
        }
    } catch (err: any) {
        res
            .status(err.status || 500)
            .json({ message: err.message || err || "error" });
    }
}
export default isAuth;