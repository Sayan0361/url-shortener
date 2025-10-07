import express from "express"
import { changeFirstNameLastName, changePassword, getUserInfo, login, logout, sendForgotPasswordCode, sendVerificationCode, signup, verifyForgotPasswordCode, verifyVerificationCode } from "../controllers/auth.controller.js";
import { authenticationMiddleware, ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", authenticationMiddleware, ensureAuthenticated, logout);

router.patch("/send-verification-code", authenticationMiddleware, ensureAuthenticated, sendVerificationCode);

router.patch("/verify-verification-code", authenticationMiddleware, ensureAuthenticated, verifyVerificationCode);

router.patch("/change-password", authenticationMiddleware, ensureAuthenticated, changePassword);

router.patch("/send-forgot-password-code", authenticationMiddleware, ensureAuthenticated, sendForgotPasswordCode);

router.patch("/verify-forgot-password-code", authenticationMiddleware, ensureAuthenticated, verifyForgotPasswordCode);

router.get("/me", authenticationMiddleware, ensureAuthenticated, getUserInfo);

router.patch("/change-name", authenticationMiddleware,ensureAuthenticated, changeFirstNameLastName);

export default router;
