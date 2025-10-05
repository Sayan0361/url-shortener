import express from "express"
import { login, logout, sendVerificationCode, signup } from "../controllers/auth.controller.js";
import { authenticationMiddleware, ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", authenticationMiddleware, ensureAuthenticated, logout);

router.patch("/send-verification-code", authenticationMiddleware, ensureAuthenticated, sendVerificationCode);

export default router;
