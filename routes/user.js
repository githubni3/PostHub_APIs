import express from "express";
// import { user } from "../models/user.js";
import { register,login,logout, getMyProfile,forgotPassword, resetPassword } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/new",register)
router.post("/login",login)
router.get("/logout",logout)
router.post("/forgotpassword",forgotPassword)
router.put("/resetpassword/:token",resetPassword)
router.get("/profile",isAuthenticated, getMyProfile)

export default router