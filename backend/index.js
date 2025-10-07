import express from "express"
import "dotenv/config"
import cookieParser from "cookie-parser" 
import userRouter from "./routes/user.routes.js"
import urlRouter from "./routes/url.routes.js"
import cors from "cors"

const app = express()
const PORT = process.env.PORT ?? 8000

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === "production" 
        ? ["your-production-domain.com"]  // Replace with your actual domain
        : ["http://localhost:5173", "http://localhost:3000"], // Vite default port
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"]
}));

app.use(express.json());
app.use(cookieParser()); 

// Public health check route
app.get("/", (req,res) => {
    return res.json({
        status: 200,
        message: `Server is working fine`
    })
})

// Auth routes (contains both public and protected routes)
app.use("/user", userRouter);

// Protected URL routes
app.use("/", urlRouter);

app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})