const { z } = require("zod");

const createTestCaseSchema = z.object({
    questionId: z.string().uuid("Invalid question ID"),

    input: z
        .string()
        .min(1, "Input is required"),

    expectedOutput: z
        .string()
        .min(1, "Expected output is required"),

    explanation: z
        .string()
        .nullable()
        .optional(),

    isSample: z
        .boolean()
        .default(false),

    points: z
        .number()
        .nonnegative("Points cannot be negative")
        .refine(
            (value) =>
                Number.isInteger(value * 100),
            {
                message:
                    "Points can have at most 2 decimal places"
            }
        ),

    displayOrder: z
        .number()
        .int("Display order must be an integer")
        .positive("Display order must be greater than 0")
});

const createBulkTestCasesSchema = z.object({
    testCases: z
        .array(
            z.object({
                input: z
                    .string()
                    .min(1, "Input is required"),

                expectedOutput: z
                    .string()
                    .min(1, "Expected output is required"),

                explanation: z
                    .string()
                    .nullable()
                    .optional(),

                isSample: z
                    .boolean()
                    .default(false),

                points: z
                    .number()
                    .nonnegative(
                        "Points cannot be negative"
                    )
                    .refine(
                        (value) =>
                            Number.isInteger(value * 100),
                        {
                            message:
                                "Points can have at most 2 decimal places"
                        }
                    ),

                displayOrder: z
                    .number()
                    .int(
                        "Display order must be an integer"
                    )
                    .positive(
                        "Display order must be greater than 0"
                    )
            })
        )
        .min(1, "At least one test case is required")
        .max(
            100,
            "Maximum 100 test cases can be created at once"
        )
});

const updateTestCaseSchema = z
    .object({
        input: z
            .string()
            .min(1, "Input is required")
            .optional(),

        expectedOutput: z
            .string()
            .min(1, "Expected output is required")
            .optional(),

        explanation: z
            .string()
            .nullable()
            .optional(),

        isSample: z
            .boolean()
            .optional(),

        points: z
            .number()
            .nonnegative("Points cannot be negative")
            .refine(
                (value) =>
                    Number.isInteger(value * 100),
                {
                    message:
                        "Points can have at most 2 decimal places"
                }
            )
            .optional(),

        displayOrder: z
            .number()
            .int("Display order must be an integer")
            .positive(
                "Display order must be greater than 0"
            )
            .optional()
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message:
                "At least one field is required for update"
        }
    );

const testCaseIdParamsSchema = z.object({
    id: z.string().uuid("Invalid test case ID")
});

const questionIdParamsSchema = z.object({
    questionId: z.string().uuid("Invalid question ID")
});

module.exports = {
    createTestCaseSchema,
    createBulkTestCasesSchema,
    updateTestCaseSchema,
    testCaseIdParamsSchema,
    questionIdParamsSchema
};