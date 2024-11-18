// ========================================
// REQUIREMENTS
// ========================================

// ========================
// Core Modules
// ========================
const mongoose = require("mongoose")

// ========================
// Custom Errors
// ========================
const { 
    BadRequestError, 
    NotFoundError 
} = require("../error/custom-errors")

// ========================================
// OBJECT ID VALIDATOR
// ========================================

// Function to check if a given string is a valid ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id)

// Middleware to validate the ObjectId in the request parameters
const validateObjectId = (req, res, next) => {
    const { id } = req.params

    // Ensure id exists before validating
    if (!id) {
        return next(new BadRequestError("Missing ObjectId in request parameters."))
    }

    // Validate the ObjectId format
    if (!isValidObjectId(id)) {
        return next(new BadRequestError(`Invalid ObjectId: ${id}`))
    }

    next()
}

// ========================================
// CHECK RESOURCE EXISTS
// ========================================

// Function to check if a resource exists
const checkResourceExists = (resource, id, resourceName) => {
    // Throw a NotFoundError if the resource is not found
    if (!resource) {
        throw new NotFoundError(`${resourceName} not found for id: ${id}`)
    }
}

// ========================================
// EXPORT VALIDATOR UTILITIES
// ========================================

module.exports = {
    validateObjectId,
    checkResourceExists,
}
