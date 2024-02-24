import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../db";
interface Expense {
    f_id: number;
    amount: number;
    category: string;
    keyword: string;
}
class ExpenseModel {

    f_id: number;
    category: string;
    amount: number;
    keyword: string;
    constructor({ f_id, category, amount, keyword }: Expense) {
        this.f_id = f_id;
        this.category = category;
        this.amount = amount;
        this.keyword = keyword;
    }
    async save(): Promise<boolean | string> {
        try {
            const conn = await db.getConnection();
            if (!conn)
                throw new Error("Could not get a pool connection");
            const query = 'INSERT INTO expenses(f_id,amount,category,keyword VALUES(?,?,?,?);';
            const values = [this.f_id, this.amount, this.category, this.keyword];
            const [result] = await conn.query<ResultSetHeader>(query, values);
            if (!result)
                throw new Error("Could not save the expense for the requested user and finance");
            if (result && result.affectedRows > 0)
                return true;
            else
                return false;
        } catch (err: any) {
            return err;
        }
    }
    static async getExpenseByUser(userId: number): Promise<RowDataPacket[] | string> {
        try {
            const conn = await db.getConnection();
            if (!conn)
                throw new Error("Could not get a pool connection");
            const query = 'SELECT users.name, users.username, f.finance_type, e.amount, e.category, e.keyword FROM users u JOIN finance f ON u.id = f.userId  JOIN expenses e ON f.id = e.f_id WHERE u.id = ?;';
            const values = [userId];
            const [result] = await conn.query<RowDataPacket[]>(query, values);
            if (!result)
                throw new Error("Could not get the expenses fro the particular user requested");
            return result;

        } catch (err: any) {
            return err;
        }
    }
}

export default ExpenseModel;