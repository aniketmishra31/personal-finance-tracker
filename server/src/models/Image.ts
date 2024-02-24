import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../db";

interface Image {
    userId: number;
    imageName: string;
    imageData: Buffer;
    imageType: string;
}

class ImageModel {
    private userId: number;
    private imageName: string;
    private imageData: Buffer;
    private imageType: string;
    constructor({ userId, imageName, imageData, imageType }: Image) {
        this.userId = userId;
        this.imageName = imageName;
        this.imageData = imageData;
        this.imageType = imageType;
    }
    async save(): Promise<boolean | string> {
        try {
            const conn = await db.getConnection();
            if (!conn) {
                throw new Error("Could not establish pool connection");
            }
            const query = 'INSERT INTO images(user_id,image_name,image_data,image_type) VALUES(?,?,?,?)';
            const values = [this.userId, this.imageName, this.imageData, this.imageType];
            const [result] = await db.query<ResultSetHeader>(query, values);
            if (!result)
                throw new Error("Could not save image");
            if (result && result.affectedRows > 0)
                return true;
            else
                return false;
        } catch (err: any) {
            return err;
        }
    }
    static async getProfileImage(userId: number): Promise<RowDataPacket | undefined> {
        try {
            const conn = await db.getConnection();
            if (!conn) {
                throw new Error("Could not establish pool connection");
            }
            const query = 'SELECT * FROM images WHERE user_id=? AND image_type="profile"';
            const values = [userId];
            const [result] = await conn.query<RowDataPacket[]>(query, values);
            if (!result)
                throw new Error("Could not get profile image for requested user");
            return result[0];
        } catch (err: any) {
            return err;
        }
    }
    static async getCoverImage(userId: number): Promise<RowDataPacket | undefined> {
        try {
            const conn = await db.getConnection();
            if (!conn) {
                throw new Error("Could not establish pool connection");
            }
            const query = 'SELECT * FROM images WHERE user_id=? AND image_type="cover"';
            const values = [userId];
            const [result] = await conn.query<RowDataPacket[]>(query, values);
            if (!result)
                throw new Error("Could not get cover image for requested user");
            return result[0];
        } catch (err: any) {
            return err;
        }
    }
}
export default ImageModel;