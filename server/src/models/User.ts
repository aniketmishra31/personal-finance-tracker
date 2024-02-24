import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../db";

interface User {
    name: string;
    email: string;
    username: string;
    password: string;
    dateOfBirth: Date
}

class UserModel {
    private name: string;
    private email: string;
    private username: string;
    private password: string;
    private dateOfBirth: Date
    constructor({ name, email, username, password, dateOfBirth }: User) {
        this.name = name;
        this.email = email;
        this.username = username;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
    }

    public async save(): Promise<User | undefined> {
        try {
            const conn = await db.getConnection();
            const query = 'INSERT INTO users (name, email, username, password, dateOfBirth) VALUES (?,?,?,?,?)';
            const values = [this.name, this.email, this.username, this.password, this.dateOfBirth];
            const [result] = await conn.query<RowDataPacket[]>(query, values);
            if (!result) {
                throw new Error("Error while saving user");
            }
            else {
                const getUserQuery = 'SELECT * FROM users WHERE email= ?';
                const getUserValues = this.email;
                const [getUserResult] = await conn.query<RowDataPacket[]>(getUserQuery, getUserValues);

                if (!getUserResult || getUserResult.length === 0) {
                    throw new Error("Error while fetching saved user");
                }
                const savedUser = getUserResult[0] as User;
                return savedUser;
            }
        }
        catch (err: any) {
            return err;
        }
    }
    public static async getUserByUsername(username: string): Promise<User | undefined> {
        try {
            const conn = await db.getConnection();
            const query = 'SELECT * FROM users WHERE username = ?';
            const values = [username];
            const [result] = await conn.query<RowDataPacket[]>(query, values);
            if (result) {
                return result[0] as User;
            }
            else {
                throw new Error("User does not exist" || `Could not find the user with email ${username}`);
            }
        }
        catch (err: any) {
            return err;
        }
    }
    public static async getUserById(id: number): Promise<User | undefined> {
        try {
            const conn = await db.getConnection();
            const query = 'SELECT * FROM users WHERE id=?';
            const values = [id];
            const [result] = await conn.query<RowDataPacket[]>(query, values);
            if (!result) {
                throw new Error("User does not exist");
            }
            else {
                return result[0] as User;
            }
        } catch (err: any) {
            return err;
        }
    }
    public static async deleteUser(user: User): Promise<boolean | string> {
        try {
            const conn = await db.getConnection();
            const query = 'DELETE FROM users WHERE email = ?';
            const values = [user.email];
            const [result] = await conn.query<ResultSetHeader>(query, values);
            if (result && result.affectedRows > 0) {
                return true;
            } else {
                throw new Error(`User with email ${user.email} not found or couldn't be deleted`);
            }
        } catch (err: any) {
            return err;
        }
    }
}
export default UserModel;