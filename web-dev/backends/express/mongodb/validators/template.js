// ========================================
// REQUIREMENTS
// ========================================

// ========================
// Validation
// ========================
const Joi = require("joi")

// ========================
// Custom Errors
// ========================
const { BadRequestError } = require("../utils/error/custom-errors")

// ========================================
// VALIDATION FUNCTIONS
// ========================================

// Input validation schema using Joi
const inputSchema = Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    age: Joi.number().min(0).max(120),
    skip: Joi.number().min(0).default(0),
    limit: Joi.number().min(1).max(100).default(10),
}).unknown(true)

// Middleware to validate and sanitize the request body
const validateInput = (req, res, next) => {
    // Ensure the request body is a valid non-null object
    if (!req.body || typeof req.body !== "object") {
        return next(new BadRequestError("Request body must be a valid JSON object."))
    }

    // Skip validation for PATCH requests with an empty body
    if (req.method === "PATCH" && Object.keys(req.body).length === 0) {
        return next()
    }

    // Validate the sanitized input data
    const { error } = inputSchema.validate(req.body, { abortEarly: false })

    // Check for validation errors
    if (error) {
        const errorMessage = `Validation Error: ${error.details.map((detail) => detail.message).join(", ")}`
        return next(new BadRequestError(errorMessage))
    }

    next()
}

// ========================================
// EXPORT VALIDATOR
// ========================================

module.exports = {
    validateInput,
}
