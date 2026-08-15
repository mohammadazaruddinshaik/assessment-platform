const ApiError = require("../utils/api-error");

const validate = (schema, source = "body") => {
    return (req, res, next) => {
        const result = schema.safeParse(req[source]);

        if (!result.success) {
            const details = result.error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }));

            return next(
                new ApiError(
                    400,
                    "Validation failed",
                    "VALIDATION_ERROR",
                    details
                )
            );
        }

        req.validated = req.validated || {};
        req.validated[source] = result.data;

        next();
    };
};

module.exports = validate;