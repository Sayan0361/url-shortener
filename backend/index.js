import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRouter from "./routes/user.routes.js";
import urlRouter from "./routes/url.routes.js";
import path from "path";

const app = express();
const PORT = process.env.PORT ?? 8000;
const __dirname = path.resolve();

app.use(cors({
    origin: "http://localhost:5173", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"], // Allowed HTTP methods
    credentials: true, // Allow cookies to be sent with requests
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({ status: 200, message: "Server is working fine" });
});

app.use("/user", userRouter);
app.use("/", urlRouter);

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"../frontend/dist")));

    app.get("*",(req,res)=>{
        res.sendFile(path.join(__dirname,"../frontend/dist/index.html"));
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
