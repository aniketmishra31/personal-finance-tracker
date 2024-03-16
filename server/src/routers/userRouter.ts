import { Router } from "express";
import isAuth from "../middleware/authMiddleware";
import { getUserProfile } from "../controllers/userController";
import { upload, addProfileImage } from "../controllers/userController";
const router = Router();

router.get("/profile", isAuth, getUserProfile);
// router to edit profile
//router to add images 
router.post("/add-profile-image", isAuth, upload.single('profile-image'), addProfileImage);
//router to delete account
export default router;