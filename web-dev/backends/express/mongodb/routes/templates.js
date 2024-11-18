// ========================================
// REQUIREMENTS
// ========================================

// ========================
// Core Modules
// ========================
const express = require("express")

// ========================
// Controllers
// ========================
const {
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
} = require("../controllers/template")

// ========================
// Validators
// ========================
const { 
    validateInput 
} = require("../validators/template")

// ========================
// Utilities
// ========================
const asyncHandler = require("express-async-handler")
const { validateObjectId } = require("../utils/validation/validator")

// ========================================
// ROUTER SETUP
// ========================================

const router = express.Router()

// ========================================
// ROUTES
// ========================================

// GET all templates
router.get("/", asyncHandler(getTemplates))

// GET template by id
router.get("/:id", validateObjectId, asyncHandler(getTemplate))

// POST a new template
router.post("/", validateInput, asyncHandler(createTemplate))

// PATCH a template by id
router.patch("/:id", validateObjectId, asyncHandler(validateInput), asyncHandler(updateTemplate))

// DELETE a template by id
router.delete("/:id", validateObjectId, asyncHandler(deleteTemplate))

// ========================================
// EXPORT ROUTE
// ========================================

module.exports = router
