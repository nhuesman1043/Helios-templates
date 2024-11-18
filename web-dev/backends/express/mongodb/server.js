// ========================================
// REQUIREMENTS
// ========================================

// ========================
// Core Modules
// ========================
const express = require("express")
const mongoose = require("mongoose")

// ========================
// Environment & Security
// ========================
require("dotenv-safe").config()
const helmet = require("helmet")
const rateLimit = require("express-rate-limit")
const expressMongoSanitize = require("express-mongo-sanitize")

// ========================
// Middleware
// ========================
const cors = require("cors")
const compression = require("compression")
const morgan = require("morgan")

// ========================
// Custom Errors
// ========================
const { BadRequestError, UnsupportedMediaTypeError } = require("./utils/error/custom-errors")

// ========================
// Routes
// ========================
const templateRoutes = require("./routes/templates")

// ========================
// Utilities
// ========================
const errorHandler = require("./utils/error/error-handler")

// ========================
// Services
// ========================


// ========================================
// EXPRESS APP SETUP
// ========================================

const app = express()
app.disable("x-powered-by")

// ========================================
// CORS CONFIGURATION
// ========================================

const corsOptions = {
    // Allow requests from the client's origin (if in production) or from any origin (if in development)    
    origin: process.env.NODE_ENV === "production" ? process.env.CORS_ORIGIN : "*",
    optionsSuccessStatus: 200,
}
app.use(cors(corsOptions))

// ========================================
// SECURITY MIDDLEWARE
// ========================================

app.use(
    helmet({
        contentSecurityPolicy: process.env.NODE_ENV === "production" ? undefined : false,
        referrerPolicy: { policy: "no-referrer" },
    })
)

// ========================================
// JSON PARSING MIDDLEWARE
// ========================================

app.use(
    express.json({
        strict: true,   // Only allow JSON data
        limit: "1mb",   // Limit the request body size to 1MB
        verify: (req, res, buf, encoding) => {
            const contentType = req.headers["content-type"]
            
            // Check for a valid content type
            if (!contentType || !contentType.includes("application/json")) {
                throw new UnsupportedMediaTypeError("Invalid content type. Expected application/json.")
            }

            // Check for an empty JSON body (edge case)
            if (buf.length === 0 && req.method !== "PATCH") {
                throw new BadRequestError("Empty JSON body is not allowed.")
            }
        },
    })
)

// ========================================
// HTTPS ENFORCEMENT (PRODUCTION ONLY)
// ========================================

if (process.env.NODE_ENV === "production") {
    // Enable trust proxy to properly handle requests behind a proxy (e.g., Nginx, AWS ELB)
    app.set("trust proxy", true)

    // Middleware to enforce HTTPS
    app.use((req, res, next) => {
        // Check if the request was forwarded as HTTP
        if (req.protocol !== "https") {
            // Redirect to HTTPS with a 301 Moved Permanently status
            return res.redirect(301, `https://${req.headers.host}${req.url}`)
        }
        next() 
    })
}

// Trust the proxy in production
if (process.env.NODE_ENV === "production") {
    app.enable("trust proxy")
}

// ========================================
// RATE LIMITING
// ========================================

// Determine the rate limit based on the environment
const isLocal = process.env.NODE_ENV === "development" || process.env.HOST === "localhost"

// Rate limit API requests
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: isLocal ? 1000 : 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: "Too many requests, please try again later.",
})
app.use("/api/v1", apiLimiter)

// ========================================
// LOGGING
// ========================================

app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"))

// ========================================
// COMPRESSION 
// ========================================

app.use(compression())

// ========================================
// SANITIZATION
// ========================================

app.use(expressMongoSanitize())

// ========================================
// API ROUTES
// ========================================

// ========================
// Template Routes
// ========================
app.use("/api/v1/templates", templateRoutes)

// ========================
// Health Check
// ========================
app.get("/health", (req, res, next) => {
    try {
        // Check the status of the MongoDB connection
        const mongoStatus = mongoose.connection.readyState === 1 ? "UP" : "DOWN"
        res.status(200).json({
            status: "UP",
            database: mongoStatus,
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            cpuUsage: process.cpuUsage(),
            activeConnections: server ? server._connections || 0 : 0,
        })
    } catch (error) {
        next(error)
    }
})

// ========================
// 404
// ========================
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`,
    })
})

// ========================================
// ERROR HANDLING
// ========================================

app.use(errorHandler) 

// ========================================
// MONGODB CONNECTION
// ========================================

let server
const connectWithRetry = async (retries = 5, delay = 5000) => {
    while (retries) {
        try {
            // Connect to MongoDB
            await mongoose.connect(process.env.MONGO_URI)
            console.log("Successfully connected to MongoDB")

            // Start the server
            server = app.listen(process.env.PORT, () => {
                console.log(`Listening on port ${process.env.PORT}`)
            })
            return
        } catch (err) {
            // Retry connection
            retries -= 1
            console.error(`MongoDB connection error: ${err.message}. Retries left: ${retries}`)

            // Wait exponentially longer each time
            await new Promise((resolve) => setTimeout(resolve, delay))
            delay *= 2 
        }
    }

    // Exit the process if retries are exhausted
    console.error("Exhausted retries. Exiting...")
    process.exit(1)
}

// ========================================
// GRACEFUL SHUTDOWN
// ========================================

const shutdownHandler = async (signal) => {
    // Log the signal and start shutdown process
    console.log(`${signal} received. Shutting down gracefully...`)

    // Close the MongoDB connection and the HTTP server
    try {
        // Close the MongoDB connection
        await mongoose.connection.close()
        console.log("MongoDB connection closed")

        // Close the HTTP server
        server.close(() => {
            console.log("HTTP server closed")
            process.exit(0)
        })
    } catch (error) {
        // Log any errors during shutdown
        console.error("Error during shutdown:", error)
        process.exit(1)
    }
}

// Handle SIGINT and SIGTERM signals
process.on("SIGINT", () => shutdownHandler("SIGINT"))   // Ctrl + C
process.on("SIGTERM", () => shutdownHandler("SIGTERM")) // Terminate

// ========================================
// START SERVER
// ========================================

connectWithRetry()