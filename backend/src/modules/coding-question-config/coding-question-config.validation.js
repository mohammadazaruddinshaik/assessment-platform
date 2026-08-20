const { z } = require("zod");


const createCodingQuestionConfigSchema = z.object({
    executionMode: z.enum([
        "STDIN_STDOUT",
        "FUNCTION"
    ]),

    timeLimitMs: z
        .coerce
        .number()
        .int()
        .min(1),

    memoryLimitMb: z
        .coerce
        .number()
        .int()
        .min(1)
});


const updateCodingQuestionConfigSchema = z
    .object({
        executionMode: z.enum([
            "STDIN_STDOUT",
            "FUNCTION"
        ]).optional(),

        timeLimitMs: z
            .coerce
            .number()
            .int()
            .min(1)
            .optional(),

        memoryLimitMb: z
            .coerce
            .number()
            .int()
            .min(1)
            .optional()
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required"
        }
    );


const questionIdSchema = z.object({
    questionId: z.string().uuid()
});


module.exports = {
    createCodingQuestionConfigSchema,
    updateCodingQuestionConfigSchema,
    questionIdSchema
};