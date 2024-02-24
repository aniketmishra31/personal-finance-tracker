import { Router } from "express";
import isAuth from "../middleware/authMiddleware";
import { getUserProfile } from "../controllers/userController";
const router = Router();

router.get("/profile", isAuth, getUserProfile);
// router to edit profile
//router to add images 
//router to delete account
export default router;