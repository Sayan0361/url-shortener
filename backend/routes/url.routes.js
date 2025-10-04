import express from "express"
import { shortCode, shorten } from "../controllers/url.controller.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// create a short url from a long url
router.post("/shorten", ensureAuthenticated ,shorten);

// /:shortCode is path parameter..this controller is to redirect the user to the targetURL
router.get("/:shortCode", shortCode);

export default router;