import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRouter from "./routes/user.routes.js";
import urlRouter from "./routes/url.routes.js";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 10000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- CORS CONFIG ----------------
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            "https://bitt-bay.vercel.app",
            "https://bit-blond.vercel.app", // frontend prod
            "http://localhost:5173",        // frontend dev
        ];

        // Allow server-to-server or Postman (no origin)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log("❌ CORS blocked for origin:", origin);
            callback(new Error("CORS not allowed"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// ---------------- LOGGING ----------------
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// ---------------- HEALTH CHECK ----------------
app.get("/health", (req, res) => {
    res.status(200).json({
        status: "OK",
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// ---------------- API ROUTES ----------------
app.get("/", (req, res) => {
    res.json({
        status: 200,
        message: "URL Shortener API is working",
        environment: process.env.NODE_ENV,
    });
});

app.use("/user", userRouter);
app.use("/", urlRouter);

// ---------------- 404 FOR UNKNOWN API ROUTES ----------------
app.use((req, res, next) => {
    if (req.path.startsWith("/user") || req.path.startsWith("/url")) {
        return res.status(404).json({ error: "Route not found" });
    }
    next();
});

// ---------------- SERVE FRONTEND (IN PRODUCTION) ----------------
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../../frontend/dist");
    console.log("📦 Serving frontend from:", frontendPath);

    app.use(express.static(frontendPath));

    // Send index.html for any non-API routes (SPA fallback)
    app.get("*", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

// ---------------- GLOBAL ERROR HANDLER ----------------
app.use((err, req, res, next) => {
    console.error("Error:", err.message);

    if (err.message.includes("CORS")) {
        return res.status(403).json({
            error: "CORS Error",
            message: "Not allowed by CORS policy",
        });
    }

    res.status(500).json({
        error: "Internal Server Error",
        message:
            process.env.NODE_ENV === "development"
                ? err.message
                : "Something went wrong",
    });
});

// ---------------- START SERVER ----------------
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    console.log(`🏠 URL: http://localhost:${PORT}`);
});
