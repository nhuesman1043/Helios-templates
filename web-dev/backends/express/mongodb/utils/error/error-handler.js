// ========================================
// CENTRALIZED ERROR HANDLER
// ========================================

const errorHandler = (err, req, res, next) => {
    // Default status code
    const statusCode = err.statusCode || 500

    // Build the error response
    const errorResponse = {
        success: false,
        statusCode,
        message: err.message || "Internal Server Error",
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
        code: err.code || "INTERNAL_ERROR",
    }

    // Handle specific Mongoose errors
    // Validation error
    if (err.name === "ValidationError") {
        errorResponse.statusCode = 400
        errorResponse.message = "Validation Error"
        errorResponse.details = Object.entries(err.errors).map(
            ([field, error]) => `${field}: ${error.message}`
        )
    } 

    // Cast error
    else if (err.name === "CastError") {
        errorResponse.statusCode = 400
        errorResponse.message = `Invalid value for field '${err.path}': ${err.value}`
    } 
    
    // Duplicate key error
    else if (err.code === 11000) {
        errorResponse.statusCode = 409
        const duplicateField = Object.keys(err.keyPattern)[0]
        errorResponse.message = `Duplicate key error: '${duplicateField}' already exists`
    } 
    
    // Invalid JSON payload
    else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        errorResponse.statusCode = 400
        errorResponse.message = "Malformed JSON payload"
    }

    // Logging in development mode
    if (process.env.NODE_ENV === "development") {
        console.error(`[${req.method} ${req.url}]`, errorResponse)
    }

    // Send the error response
    res.status(errorResponse.statusCode).json(errorResponse)
}

// ========================================
// EXPORT ERROR HANDLER
// ========================================

module.exports = errorHandler
