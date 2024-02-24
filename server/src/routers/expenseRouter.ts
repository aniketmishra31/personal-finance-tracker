import { Router } from "express";
const router = Router();

router.get("/", /*getExpenses*/);
router.post("/add-expense",/*addExpenses*/);
router.put("/edit-expense",/*editExpense*/);
router.delete("/delete-expense",/*deleteExpense*/);
export default router;