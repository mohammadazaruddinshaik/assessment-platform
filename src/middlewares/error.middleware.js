const ApiError = require("../utils/api-error");

const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
            error: {
                code: err.code,
                details: err.details
            }
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal server error",
        error: {
            code: "INTERNAL_SERVER_ERROR"
        }
    });
};

module.exports = errorMiddleware;