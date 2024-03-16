import db from "../config/db";
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
}

export default ExpenseModel;