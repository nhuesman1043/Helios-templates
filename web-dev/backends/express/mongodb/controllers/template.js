// ========================================
// REQUIREMENTS
// ========================================

// ========================
// Models
// ========================
const Template = require("../models/template")

// ========================
// Utitlities
// ========================
const { checkResourceExists } = require("../utils/validation/validator")

// ========================
// Services
// ========================


// ========================================
// CRUD OPERATIONS
// ========================================

// Function to fetch all templates based on the query parameters
const getTemplates = async (req, res, next) => {
    try {
        // Extract the allowed filters from the query parameters
        const allowedFilters = ["firstName", "lastName", "age"]
        const filters = Object.keys(req.query)
            .filter((key) => allowedFilters.includes(key))
            .reduce((obj, key) => {
                obj[key] = req.query[key]
                return obj
            }, {})

        // Extract the limit and skip values from the query parameters
        const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100)
        const skip = parseInt(req.query.skip, 10) || 0

        // Fetch the templates from the database based on the filters, limit, and skip values
        const templates = await Template.find({ ...filters, isDeleted: { $ne: true } })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .lean()

        // Successful fetch
        res.status(200).json({
            success: true,
            data: templates,
            message: "Templates fetched successfully",
        })
    } catch (error) {
        next(error)
    }
}

// Function to fetch a single template based on the id
const getTemplate = async (req, res, next) => {
    // Extract the id from the request parameters
    const { id } = req.params

    try {
        // Fetch the template from the database based on the id
        const template = await Template.findOne({ id, isDeleted: { $ne: true } }).lean()

        // Check if the template exists
        checkResourceExists(template, id, "Template")

        // Successful fetch
        res.status(200).json({
            success: true,
            data: template,
            message: "Template fetched successfully",
        })
    } catch (error) {
        next(error)
    }
}

// Function to create a new template
const createTemplate = async (req, res, next) => {
    // Extract the input data from the request body
    const { firstName, lastName, age } = req.body

    try {
        // Create a new template
        const template = await Template.create({ firstName, lastName, age })

        // Successful creation
        res.status(201).json({
            success: true,
            data: template,
            message: "Template created successfully",
        })
    } catch (error) {
        next(error)
    }
}

// Function to update a template based on the id
const updateTemplate = async (req, res, next) => {
    // Extract the id from the request parameters
    const { id } = req.params

    // Extract input data from the request body
    const updateData = req.body

    try {
        // Update the template based on the id
        const template = await Template.findOneAndUpdate(
            { id, isDeleted: { $ne: true } },
            { $set: updateData },
            { new: true, runValidators: true }
        ).lean()

        // Check if the template exists
        checkResourceExists(template, id, "Template")

        // Successful update
        res.status(200).json({
            success: true,
            data: template,
            message: "Template updated successfully",
        })
    } catch (error) {
        next(error)
    }
}

// Function to delete a template based on the id
const deleteTemplate = async (req, res, next) => {
    // Extract the id from the request parameters
    const { id } = req.params

    try {
        // Soft delete the template based on the id
        const template = await Template.findOneAndUpdate(
            { id, isDeleted: { $ne: true } },
            { $set: { isDeleted: true } },
            { new: true }
        ).lean()

        // Check if the template exists
        checkResourceExists(template, id, "Template")

        // Successful deletion
        res.status(200).json({
            success: true,
            message: "Template marked as deleted successfully",
        })
    } catch (error) {
        next(error)
    }
}

// ========================================
// EXPORT CONTROLLER
// ========================================

module.exports = {
    getTemplates,
    getTemplate,
    createTemplate,
    updateTemplate,
    deleteTemplate,
}
