const prisma = require("../../lib/prisma");

const createQuestion = async (data) => {
    return prisma.$transaction(async (tx) => {
        const { tagIds, ...questionData } = data;

        const question = await tx.question.create({
            data: questionData
        });

        if (tagIds?.length) {
            await tx.questionTag.createMany({
                data: tagIds.map((tagId) => ({
                    questionId: question.id,
                    tagId
                }))
            });
        }

        const createdQuestion = await tx.question.findUnique({
            where: {
                id: question.id
            },
            select: {
                id: true,
                categoryId: true,
                title: true,
                description: true,
                constraints: true,
                questionType: true,
                difficulty: true,
                status: true,
                createdBy: true,
                updatedBy: true,
                createdAt: true,
                updatedAt: true,

                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        status: true
                    }
                },

                tags: {
                    select: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                status: true
                            }
                        }
                    }
                }
            }
        });

        return {
            ...createdQuestion,
            tags: createdQuestion.tags.map(
                ({ tag }) => tag
            )
        };
    });
};

const findQuestionById = async (id) => {
    const question = await prisma.question.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            categoryId: true,
            title: true,
            description: true,
            constraints: true,
            questionType: true,
            difficulty: true,
            status: true,
            createdBy: true,
            updatedBy: true,
            createdAt: true,
            updatedAt: true,

            category: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true
                }
            },

            tags: {
                select: {
                    tag: {
                        select: {
                            id: true,
                            name: true,
                            description: true,
                            status: true
                        }
                    }
                }
            }
        }
    });

    if (!question) {
        return null;
    }

    return {
        ...question,
        tags: question.tags.map(({ tag }) => tag)
    };
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
                description: true,
                constraints: true,
                questionType: true,
                difficulty: true,
                status: true,
                categoryId: true,
                createdAt: true,
                updatedAt: true,

                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        status: true
                    }
                },

                tags: {
                    select: {
                        tag: {
                            select: {
                                id: true,
                                name: true,
                                description: true,
                                status: true
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

const deleteQuestion = async (id) => {
    return prisma.question.delete({
        where: { id }
    });
};


const createQuestionTag = async (questionId, tagId) => {
    return prisma.questionTag.create({
        data: {
            questionId,
            tagId
        },
        include: {
            tag: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true
                }
            }
        }
    });
};

const findQuestionTag = async (questionId, tagId) => {
    return prisma.questionTag.findUnique({
        where: {
            questionId_tagId: {
                questionId,
                tagId
            }
        }
    });
};


const findQuestionTags = async (questionId) => {
    return prisma.questionTag.findMany({
        where: {
            questionId
        },
        orderBy: {
            createdAt: "asc"
        },
        select: {
            createdAt: true,
            tag: {
                select: {
                    id: true,
                    name: true,
                    description: true,
                    status: true
                }
            }
        }
    });
};

const deleteQuestionTag = async (questionId, tagId) => {
    return prisma.questionTag.delete({
        where: {
            questionId_tagId: {
                questionId,
                tagId
            }
        }
    });
};


module.exports = {
    createQuestion,
    findQuestionById,
    findQuestions,
    updateQuestion,
    deleteQuestion,
    createQuestionTag,
    findQuestionTag,
    findQuestionTags,
    deleteQuestionTag
};