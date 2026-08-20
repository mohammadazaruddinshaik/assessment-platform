class ApiResponse {
    // 200 - Success
    static success(res, data = null, message = "Success", statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    // 201 - Created
    static created(res, data = null, message = "Created successfully") {
        return res.status(201).json({
            success: true,
            message,
            data
        });
    }

    // 204 - No Content
    static noContent(res) {
        return res.status(204).send();
    }

    // 400 - Bad Request
    static badRequest(res, message = "Bad request", data = null) {
        return res.status(400).json({
            success: false,
            message,
            data
        });
    }

    // 401 - Unauthorized
    static unauthorized(res, message = "Unauthorized", data = null) {
        return res.status(401).json({
            success: false,
            message,
            data
        });
    }

    // 403 - Forbidden
    static forbidden(res, message = "Forbidden", data = null) {
        return res.status(403).json({
            success: false,
            message,
            data
        });
    }

    // 404 - Not Found
    static notFound(res, message = "Resource not found", data = null) {
        return res.status(404).json({
            success: false,
            message,
            data
        });
    }

    // 409 - Conflict
    static conflict(res, message = "Resource already exists", data = null) {
        return res.status(409).json({
            success: false,
            message,
            data
        });
    }

    // 422 - Validation Error
    static validationError(
        res,
        message = "Validation failed",
        errors = null
    ) {
        return res.status(422).json({
            success: false,
            message,
            errors
        });
    }

    // 429 - Too Many Requests
    static tooManyRequests(
        res,
        message = "Too many requests",
        data = null
    ) {
        return res.status(429).json({
            success: false,
            message,
            data
        });
    }

    // 500 - Internal Server Error
    static serverError(
        res,
        message = "Internal server error",
        data = null
    ) {
        return res.status(500).json({
            success: false,
            message,
            data
        });
    }

    // Generic error response
    static error(
        res,
        message = "Something went wrong",
        statusCode = 500,
        data = null
    ) {
        return res.status(statusCode).json({
            success: false,
            message,
            data
        });
    }
}

module.exports = ApiResponse;