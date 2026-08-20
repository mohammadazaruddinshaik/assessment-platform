const { z } = require("zod");


const createQuestionMediaSchema = z.object({
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


const updateQuestionMediaSchema = z
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


const questionIdSchema = z.object({
    questionId: z.string().uuid()
});


const questionMediaParamsSchema = z.object({
    questionId: z.string().uuid(),
    mediaId: z.string().uuid()
});


module.exports = {
    createQuestionMediaSchema,
    updateQuestionMediaSchema,
    questionIdSchema,
    questionMediaParamsSchema
};