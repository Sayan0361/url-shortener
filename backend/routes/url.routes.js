import express from "express"
import { deleteCreatedURL, getAllCreatedCodes, getTargetURL, shorten, updateCreatedURL } from "../controllers/url.controller.js";
import { authenticationMiddleware } from "../middlewares/auth.middleware.js"

const router = express.Router();

// Apply authentication to all URL routes
router.use(authenticationMiddleware);

// create a short url from a long url
router.post("/shorten", shorten);

// user will get all his created codes
router.get("/codes", getAllCreatedCodes);

// delete ur created url
router.delete("/delete/:id", deleteCreatedURL);

//  update the destination (long) URL of an existing short URL
router.put("/update/:id", updateCreatedURL);

// /:shortCode is path parameter..this controller is to redirect the user to the targetURL
router.get("/:shortCode", getTargetURL);

export default router;