const { z } = require("zod");

const createCategorySchema = z.object({
    name: z.string().trim().min(1).max(100),

    description: z.string().trim().max(500).optional(),

    status: z.enum([
        "ACTIVE",
        "INACTIVE"
    ]).default("ACTIVE")
});

const categoryIdSchema = z.object({
    categoryId: z.string().uuid()
});


const updateCategorySchema = z
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
    createCategorySchema,
    categoryIdSchema,
    updateCategorySchema
};


