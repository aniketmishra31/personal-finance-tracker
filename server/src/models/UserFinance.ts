import { ResultSetHeader, RowDataPacket } from "mysql2";
import db from "../db";

interface Finance {
    userId: number;
    financeType: string;
}
class UserFinance {
    userId: number;
    financeType: string;
    constructor({ userId, financeType }: Finance) {
        this.userId = userId;
        this.financeType = financeType;
    }
    async save(): Promise<boolean | string> {
        try {
            const conn = await db.getConnection();
            if (!conn)
                throw new Error("Failed to get a pool connection");
            const query = 'INSERT INTO finance(user_id,finance_type) VALUES(?,?)';
            const values = [this.userId, this.financeType];
            const [result] = await conn.query<ResultSetHeader>(query, values);
            if (!result)
                throw new Error("Could not save the finance for the requested user");
            if (result && result.affectedRows > 0)
                return true;
            else
                return false;
        } catch (err: any) {
            return err;
        }
    }
}
export default UserFinance;