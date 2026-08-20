const { z } = require("zod");


const createTestCaseMediaSchema = z.object({
    type: z.enum([
        "IMAGE",
        "GIF"
    ]),

    url: z
        .string()
        .trim()
        .url("Invalid media URL")
        .max(2048)
        .optional(),

    altText: z
        .string()
        .trim()
        .max(500)
        .optional(),

    displayOrder: z
        .coerce
        .number()
        .int()
        .min(1)
});


const updateTestCaseMediaSchema = z
    .object({
        type: z.enum([
            "IMAGE",
            "GIF"
        ]).optional(),

        url: z
            .string()
            .trim()
            .url("Invalid media URL")
            .max(2048)
            .optional(),

        altText: z
            .string()
            .trim()
            .max(500)
            .nullable()
            .optional(),

        displayOrder: z
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


const testCaseIdSchema = z.object({
    testCaseId: z.string().uuid()
});


const testCaseMediaParamsSchema = z.object({
    testCaseId: z.string().uuid(),
    mediaId: z.string().uuid()
});


module.exports = {
    createTestCaseMediaSchema,
    updateTestCaseMediaSchema,
    testCaseIdSchema,
    testCaseMediaParamsSchema
};