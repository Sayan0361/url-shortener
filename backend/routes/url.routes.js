import express from "express"
import { getAllCreatedCodes, getTargetURL, shorten } from "../controllers/url.controller.js";
import { ensureAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

// create a short url from a long url
router.post("/shorten", ensureAuthenticated , shorten);

// user will get all his created codes
router.get("/codes", ensureAuthenticated, getAllCreatedCodes);

// /:shortCode is path parameter..this controller is to redirect the user to the targetURL
router.get("/:shortCode", getTargetURL);

export default router;