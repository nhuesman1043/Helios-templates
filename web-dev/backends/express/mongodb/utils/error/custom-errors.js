// ========================================
// CUSTOM ERROR CLASSES
// ========================================

// Base Error Class
class BaseError extends Error {
    constructor(name, statusCode, message, code, details = null) {
        super(message)
        this.name = name
        this.statusCode = statusCode
        this.code = code || "INTERNAL_ERROR"
        this.details = details
        Error.captureStackTrace(this, this.constructor)
    }
}

// 400 - Bad Request Error
class BadRequestError extends BaseError {
    constructor(message, details) {
        super("BadRequestError", 400, message, "BAD_REQUEST", details)
    }
}

// 401 - Unauthorized Error
class UnauthorizedError extends BaseError {
    constructor(message, details) {
        super("UnauthorizedError", 401, message, "UNAUTHORIZED", details)
    }
}

// 403 - Forbidden Error
class ForbiddenError extends BaseError {
    constructor(message, details) {
        super("ForbiddenError", 403, message, "FORBIDDEN", details)
    }
}

// 404 - Not Found Error
class NotFoundError extends BaseError {
    constructor(message, details) {
        super("NotFoundError", 404, message, "NOT_FOUND", details)
    }
}

// 409 - Conflict Error (Duplicate Key)
class ConflictError extends BaseError {
    constructor(message, details) {
        super("ConflictError", 409, message, "CONFLICT", details)
    }
}

// 415 - Unsupported Media Type Error
class UnsupportedMediaTypeError extends BaseError {
    constructor(message, details) {
        super("UnsupportedMediaTypeError", 415, message, "UNSUPPORTED_MEDIA_TYPE", details)
    }
}

// 500 - Internal Server Error
class InternalServerError extends BaseError {
    constructor(message, details) {
        super("InternalServerError", 500, message, "INTERNAL_SERVER_ERROR", details)
    }
}

// 500 - Database Error
class DatabaseError extends BaseError {
    constructor(message, details) {
        super("DatabaseError", 500, message, "DATABASE_ERROR", details)
    }
}

// ========================================
// EXPORT ERROR CLASSES
// ========================================

module.exports = {
    BadRequestError,
    UnauthorizedError,
    ForbiddenError,
    NotFoundError,
    ConflictError,
    UnsupportedMediaTypeError,
    InternalServerError,
    DatabaseError,
}
