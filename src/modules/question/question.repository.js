const prisma = require("../../lib/prisma");

const createQuestion = async (data) => {
    return prisma.question.create({
        data
    });
};

const findQuestionById = async (id) => {
    return prisma.question.findUnique({
        where: { id }
    });
};

const findQuestions = async ({ where, skip, take }) => {
    const [questions, total] = await prisma.$transaction([
        prisma.question.findMany({
            where,
            skip,
            take,
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                title: true,
                questionType: true,
                difficulty: true,
                status: true,
                categoryId: true,
                createdAt: true,
                updatedAt: true,

                category: {
                    select: {
                        id: true,
                        name: true
                    }
                },

                tags: {
                    select: {
                        tag: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            }
        }),

        prisma.question.count({
            where
        })
    ]);

    return {
        questions,
        total
    };
};


const updateQuestion = async (id, data) => {
    return prisma.question.update({
        where: { id },
        data
    });
};



module.exports = {
    createQuestion,
    findQuestionById,
    findQuestions,
    updateQuestion
};