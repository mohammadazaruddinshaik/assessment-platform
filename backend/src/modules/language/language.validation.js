const { z } = require("zod");

const createLanguageSchema = z.object({
    name: z.string().trim().min(1).max(100),

    code: z
        .string()
        .trim()
        .min(1)
        .max(50)
        .regex(
            /^[a-z0-9_-]+$/,
            "Code can only contain lowercase letters, numbers, hyphens and underscores"
        ),

    status: z
        .enum(["ACTIVE", "INACTIVE"])
        .default("ACTIVE")
});

const languageIdSchema = z.object({
    languageId: z.string().uuid()
});

const updateLanguageSchema = z.object({
    name: z.string().trim().min(1).max(100).optional(),

    status: z
        .enum(["ACTIVE", "INACTIVE"])
        .optional()
}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);


const listLanguagesSchema = z.object({
    status: z.enum([
        "ACTIVE",
        "INACTIVE"
    ]).optional()
});


module.exports = {
    createLanguageSchema,
    languageIdSchema,
    updateLanguageSchema,
    listLanguagesSchema
};