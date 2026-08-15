const { z } = require("zod");

const createTagSchema = z.object({
    name: z.string().trim().min(1).max(100),

    description: z.string().trim().max(500).optional(),

    status: z.enum([
        "ACTIVE",
        "INACTIVE"
    ]).default("ACTIVE")
});

const tagIdSchema = z.object({
    tagId: z.string().uuid()
});


const updateTagSchema = z
    .object({
        name: z.string().trim().min(1).max(100).optional(),

        description: z.string().trim().max(500).nullable().optional(),

        status: z.enum([
            "ACTIVE",
            "INACTIVE"
        ]).optional()
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required"
        }
    );



module.exports = {
    createTagSchema,
    tagIdSchema,
    updateTagSchema
};