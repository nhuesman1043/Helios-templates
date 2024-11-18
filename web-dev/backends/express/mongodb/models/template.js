// ========================================
// REQUIREMENTS
// ========================================

// ========================
// Core Modules
// ========================
const mongoose = require("mongoose")

// ========================
// Utitlities
// ========================
const { ValidationError } = require("../utils/error/custom-errors")

// ========================================
// TEMPLATE SCHEMA
// ========================================

const Schema = mongoose.Schema
const templateSchema = new Schema(
    {
        // First name of template
        firstName: {
            type: String,
            required: [true, "'firstName' is required"],
            trim: true,
            minlength: [2, "'firstName' must be at least 2 characters long"],
            maxlength: [50, "'firstName' cannot exceed 50 characters"],
        },

        // Last name of template
        lastName: {
            type: String,
            required: [true, "'lastName' is required"],
            trim: true,
            minlength: [2, "'lastName' must be at least 2 characters long"],
            maxlength: [50, "'lastName' cannot exceed 50 characters"],
        },

        // Age of template
        age: {
            type: Number,
            default: 0,
            required: [true, "'age' is required"],
            min: [0, "'age' must be a positive number"],
            max: [120, "'age' cannot exceed 120"],
        },

        // Deletion status of template
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    // Adds createdAt and updatedAt fields
    { timestamps: true }
)

// ========================================
// VALIDATION HOOKS
// ========================================

templateSchema.pre("validate", function (next) {
    // Ensure isDeleted is not set to true for new documents
    if (this.isNew && this.isDeleted) {
        this.isDeleted = false
    }

    // Prevent setting isDeleted to true for new documents
    if (this.isModified("isDeleted") && this.isDeleted && this.isNew) {
        return next(new ValidationError("Cannot set 'isDeleted' to true for new documents."))
    }

    // Prevent setting isDeleted to null or undefined during updates
    if (this.isModified("isDeleted") && (this.isDeleted === null || this.isDeleted === undefined)) {
        this.isDeleted = false
    }

    next()
})

// ========================================
// INDEXES
// ========================================

templateSchema.index({ isDeleted: 1 })

// ========================================
// EXPORT MODEL
// ========================================

module.exports = mongoose.model("Template", templateSchema)