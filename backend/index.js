import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import userRouter from "./routes/user.routes.js";
import urlRouter from "./routes/url.routes.js";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 10000;

// Fix for __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS configuration
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = [
            "https://bit-blond.vercel.app",
            "http://localhost:5173"
        ];
        
        // Allow requests with no origin (like mobile apps or server-to-server)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log('CORS blocked for origin:', origin);
            callback(new Error('CORS not allowed'));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// API routes
app.get("/", (req, res) => {
    res.json({ 
        status: 200, 
        message: "URL Shortener API is working",
        environment: process.env.NODE_ENV
    });
});

app.use("/user", userRouter);
app.use("/", urlRouter);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    // Path to frontend build directory (one level up from backend)
    const frontendPath = path.join(__dirname, '../../frontend/dist');
    console.log('Serving frontend from:', frontendPath);
    
    // Serve static files
    app.use(express.static(frontendPath));
    
    // Handle SPA routing - serve index.html for all unknown routes
    app.get('*', (req, res) => {
        // Don't handle API routes
        if (req.path.startsWith('/api') || req.path.startsWith('/user') || req.path.startsWith('/url')) {
            return res.status(404).json({ error: 'Route not found' });
        }
        res.sendFile(path.join(frontendPath, 'index.html'));
    });
}

// 404 handler for API routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.message);
    
    if (err.message.includes('CORS')) {
        return res.status(403).json({ 
            error: "CORS Error", 
            message: "Not allowed by CORS policy"
        });
    }
    
    res.status(500).json({ 
        error: "Internal Server Error",
        message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🏠 URL: http://localhost:${PORT}`);
});