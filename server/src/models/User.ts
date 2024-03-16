import db from "../config/db";

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

    public async save(): Promise<User & { id: number } | undefined> {
        try {
            const { data, error } = await db.from("users").insert(this).single();
            if (error)
                throw error;
            const user = await UserModel.getUserByUsername(this.username);
            if (!user)
                return undefined;
            return user;
        }
        catch (err: any) {
            return err;
        }
    }
    public static async getUserByUsername(username: string): Promise<User & { id: number } | undefined> {
        try {
            const { data, error } = await db
                .from("users")
                .select("*")
                .eq("username", username)
                .single();
            if (error)
                throw error;
            if (!data)
                return undefined;
            return data as User & { id: number };
        } catch (err: any) {
            return err;
        }
    }
    public static async getUserById(id: number): Promise<User & { id: number } | undefined> {
        try {
            const { data, error } = await db
                .from("users")
                .select("*")
                .eq("id", id)
                .single();
            if (error)
                throw error;
            if (!data)
                return undefined;
            return data;
        } catch (err: any) {
            return err;
        }
    }
}
export default UserModel;