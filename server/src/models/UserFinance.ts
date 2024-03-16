import db from "../config/db";

interface Finance {
    user_id: number;
    finance_type: string;
}
class UserFinance {
    user_id: number;
    finance_type: string;
    constructor({ user_id, finance_type }: Finance) {
        this.user_id = user_id;
        this.finance_type = finance_type;
    }
    async save(): Promise<boolean | string> {
        try {
            const { data, error } = await db
                .from("user-finances")
                .insert(this)
                .single();
            if (error)
                throw error;
            return true;
        } catch (err: any) {
            return err;
        }
    }
    async getFinancesByUserId(user_id: number): Promise<Finance & { f_id: number }[] | undefined> {
        try {
            const { data, error } = await db
                .from("user-finances")
                .select("*")
                .eq("user_id", user_id);
            if (error)
                throw error;
            if (!data)
                return undefined;
            return data as Finance & { f_id: number }[];
        } catch (err: any) {
            return err;
        }
    }
    async getUserExpenses(user_id: number): Promise<Finance & { f_id: number }[] | undefined> {
        try {
            const { data, error } = await db
                .from("user-finances")
                .select("*")
                .eq("user_id", user_id)
                .eq("finance_type", "expense");
            if (error)
                throw error;
            if (!data)
                return undefined;
            return data as Finance & { f_id: number }[];
        } catch (err: any) {
            console.log(err);
            return err;
        }
    }
}
export default UserFinance;