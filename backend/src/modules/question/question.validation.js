const { z } = require("zod");

const createQuestionSchema = z.object({
    categoryId: z.string().uuid().optional(),

    title: z.string().trim().min(1).max(255),

    description: z.string().trim().min(1),

    constraints: z.string().trim().optional(),

    questionType: z.enum([
        "CODING",
        "MCQ",
        "SQL",
        "SUBJECTIVE",
        "FILE_UPLOAD"
    ]),

    difficulty: z.enum([
        "EASY",
        "MEDIUM",
        "HARD"
    ]),

    status: z.enum([
        "DRAFT",
        "PUBLISHED",
        "ARCHIVED"
    ]).default("DRAFT"),

    tagIds: z.array(
        z.string().uuid()
    ).optional()
});

const questionIdSchema = z.object({
    questionId: z.string().uuid()
});


const listQuestionsSchema = z.object({
    categoryId: z.string().uuid().optional(),

    tagId: z.string().uuid().optional(),

    difficulty: z.enum([
        "EASY",
        "MEDIUM",
        "HARD"
    ]).optional(),

    questionType: z.enum([
        "CODING",
        "MCQ",
        "SQL",
        "SUBJECTIVE",
        "FILE_UPLOAD"
    ]).optional(),

    status: z.enum([
        "DRAFT",
        "PUBLISHED",
        "ARCHIVED"
    ]).optional(),

    search: z.string().trim().min(1).max(100).optional(),

    page: z.coerce.number().int().min(1).default(1),

    limit: z.coerce.number().int().min(1).max(100).default(20)
});


const updateQuestionSchema = z
    .object({
        categoryId: z.string().uuid().nullable().optional(),

        title: z.string().trim().min(1).max(255).optional(),

        description: z.string().trim().min(1).optional(),

        constraints: z.string().trim().nullable().optional(),

        questionType: z.enum([
            "CODING",
            "MCQ",
            "SQL",
            "SUBJECTIVE",
            "FILE_UPLOAD"
        ]).optional(),

        difficulty: z.enum([
            "EASY",
            "MEDIUM",
            "HARD"
        ]).optional(),

        status: z.enum([
            "DRAFT",
            "PUBLISHED",
            "ARCHIVED"
        ]).optional()
    })
    .refine(
        (data) => Object.keys(data).length > 0,
        {
            message: "At least one field is required"
        }
    );


const addQuestionTagSchema = z.object({
    tagId: z.string().uuid()
});


const questionTagParamsSchema = z.object({
    questionId: z.string().uuid(),
    tagId: z.string().uuid()
});


module.exports = {
    createQuestionSchema,
    questionIdSchema,
    listQuestionsSchema,
    updateQuestionSchema,
    addQuestionTagSchema,
    questionTagParamsSchema
};