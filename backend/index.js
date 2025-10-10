import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRouter from "./routes/user.routes.js";
import urlRouter from "./routes/url.routes.js";

const app = express();
const PORT = process.env.PORT ?? 8000;

const DEV_ORIGINS = ["http://localhost:5173", "http://localhost:5000"];
const PROD_ORIGINS = ["https://bit-blond.vercel.app"];

const allowedOrigins = process.env.NODE_ENV === "production" ? PROD_ORIGINS : DEV_ORIGINS;

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("CORS not allowed"));
        }
    },
    credentials: true
}));

// handle OPTIONS preflight for all routes
app.options("*", cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ status: 200, message: "Server is working fine" });
});

app.use("/user", userRouter);
app.use("/", urlRouter);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
