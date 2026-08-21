const prisma = require("../../lib/prisma");


// =====================================================
// CREATE QUESTION
// =====================================================

const createQuestion = async (data) => {
    return prisma.$transaction(async (tx) => {
        const {
            tagIds,
            languages,
            ...questionData
        } = data;

        const question = await tx.question.create({
            data: questionData
        });

        // -----------------------------
        // Add Tags
        // -----------------------------

        if (tagIds?.length) {
            await tx.questionTag.createMany({
                data: tagIds.map((tagId) => ({
                    questionId: question.id,
                    tagId
                }))
            });
        }

        // -----------------------------
        // Add Languages
        // -----------------------------

        if (languages?.length) {
            await tx.questionLanguage.createMany({
                data: languages.map((item) => ({
                    questionId: question.id,
                    languageId: item.languageId,
                    starterCode: item.starterCode
                }))
            });
        }

        // -----------------------------
        // Return Created Question
        // -----------------------------

        const createdQuestion =
            await tx.question.findUnique({
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
                    },

                    languages: {
                        select: {
                            languageId: true,
                            starterCode: true,

                            language: {
                                select: {
                                    id: true,
                                    name: true,
                                    code: true,
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
            ),

            languages:
                createdQuestion.languages.map(
                    ({
                        languageId,
                        starterCode,
                        language
                    }) => ({
                        languageId,
                        starterCode,
                        ...language
                    })
                )
        };
    });
};


// =====================================================
// GET QUESTION BY ID
// =====================================================

const findQuestionById = async (id) => {
    const question =
        await prisma.question.findUnique({
            where: {
                id
            },

            select: {
                // =================================================
                // QUESTION
                // =================================================

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


                // =================================================
                // CATEGORY
                // =================================================

                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        status: true
                    }
                },


                // =================================================
                // TAGS
                // =================================================

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
                },


                // =================================================
                // LANGUAGES
                // =================================================

                languages: {
                    select: {
                        languageId: true,
                        starterCode: true,

                        language: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                status: true
                            }
                        }
                    }
                },


                // =================================================
                // QUESTION MEDIA
                // =================================================

                media: {
                    orderBy: {
                        displayOrder: "asc"
                    },

                    select: {
                        id: true,
                        type: true,
                        url: true,
                        publicId: true,
                        altText: true,
                        displayOrder: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },


                // =================================================
                // CODING CONFIG
                // =================================================

                codingConfig: {
                    select: {
                        id: true,
                        executionMode: true,
                        timeLimitMs: true,
                        memoryLimitMb: true,
                        createdAt: true,
                        updatedAt: true
                    }
                },


                // =================================================
                // TEST CASES
                // =================================================

                testCases: {
                    orderBy: {
                        displayOrder: "asc"
                    },

                    select: {
                        id: true,
                        input: true,
                        expectedOutput: true,
                        explanation: true,
                        isSample: true,
                        points: true,
                        displayOrder: true,
                        createdAt: true,
                        updatedAt: true,


                        // =========================================
                        // TEST CASE MEDIA
                        // =========================================

                        media: {
                            orderBy: {
                                displayOrder: "asc"
                            },

                            select: {
                                id: true,
                                type: true,
                                url: true,
                                publicId: true,
                                altText: true,
                                displayOrder: true,
                                createdAt: true,
                                updatedAt: true
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

        tags: question.tags.map(
            ({ tag }) => tag
        ),

        languages:
            question.languages.map(
                ({
                    languageId,
                    starterCode,
                    language
                }) => ({
                    languageId,
                    starterCode,
                    ...language
                })
            )
    };
};

// =====================================================
// LIST QUESTIONS
// =====================================================

const findQuestions = async ({
    where,
    skip,
    take
}) => {

    // We don't need a transaction for these
    // independent read operations.

    const questions =
        await prisma.question.findMany({
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

                // -----------------------------
                // Category
                // -----------------------------

                category: {
                    select: {
                        id: true,
                        name: true,
                        description: true,
                        status: true
                    }
                },

                // -----------------------------
                // Tags
                // -----------------------------

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
                },

                // -----------------------------
                // Languages
                // -----------------------------

                languages: {
                    select: {
                        languageId: true,
                        starterCode: true,

                        language: {
                            select: {
                                id: true,
                                name: true,
                                code: true,
                                status: true
                            }
                        }
                    }
                }
            }
        });

    const total =
        await prisma.question.count({
            where
        });

    return {
        questions,
        total
    };
};


// =====================================================
// UPDATE QUESTION
// =====================================================

const updateQuestion = async (id, data) => {
    return prisma.$transaction(async (tx) => {

        const {
            tagIds,
            languages,
            ...questionData
        } = data;


        // =================================================
        // 1. Update Question Fields
        // =================================================

        await tx.question.update({
            where: {
                id
            },

            data: questionData
        });


        // =================================================
        // 2. Synchronize Tags
        // =================================================

        if (tagIds !== undefined) {

            const existingTags =
                await tx.questionTag.findMany({
                    where: {
                        questionId: id
                    },

                    select: {
                        tagId: true
                    }
                });

            const existingTagIds =
                existingTags.map(
                    (item) => item.tagId
                );


            // Tags that need to be removed

            const tagsToRemove =
                existingTagIds.filter(
                    (tagId) =>
                        !tagIds.includes(tagId)
                );


            // Tags that need to be added

            const tagsToAdd =
                tagIds.filter(
                    (tagId) =>
                        !existingTagIds.includes(tagId)
                );


            if (tagsToRemove.length) {

                await tx.questionTag.deleteMany({
                    where: {
                        questionId: id,

                        tagId: {
                            in: tagsToRemove
                        }
                    }
                });
            }


            if (tagsToAdd.length) {

                await tx.questionTag.createMany({
                    data: tagsToAdd.map(
                        (tagId) => ({
                            questionId: id,
                            tagId
                        })
                    )
                });
            }
        }


        // =================================================
        // 3. Synchronize Languages
        // =================================================

        if (languages !== undefined) {

            const existingLanguages =
                await tx.questionLanguage.findMany({
                    where: {
                        questionId: id
                    },

                    select: {
                        languageId: true
                    }
                });


            const existingLanguageIds =
                existingLanguages.map(
                    (item) => item.languageId
                );


            const requestedLanguageIds =
                languages.map(
                    (item) => item.languageId
                );


            // Languages that need to be removed

            const languagesToRemove =
                existingLanguageIds.filter(
                    (languageId) =>
                        !requestedLanguageIds.includes(
                            languageId
                        )
                );


            if (languagesToRemove.length) {

                await tx.questionLanguage.deleteMany({
                    where: {
                        questionId: id,

                        languageId: {
                            in: languagesToRemove
                        }
                    }
                });
            }


            // Add new languages
            // Update existing languages

            for (const item of languages) {

                const exists =
                    existingLanguageIds.includes(
                        item.languageId
                    );


                if (exists) {

                    await tx.questionLanguage.update({
                        where: {
                            questionId_languageId: {
                                questionId: id,
                                languageId:
                                    item.languageId
                            }
                        },

                        data: {
                            starterCode:
                                item.starterCode
                        }
                    });

                } else {

                    await tx.questionLanguage.create({
                        data: {
                            questionId: id,
                            languageId:
                                item.languageId,
                            starterCode:
                                item.starterCode
                        }
                    });
                }
            }
        }


        // =================================================
        // 4. Return Updated Question
        // =================================================

        const updatedQuestion =
            await tx.question.findUnique({
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
                    },

                    languages: {
                        select: {
                            languageId: true,
                            starterCode: true,

                            language: {
                                select: {
                                    id: true,
                                    name: true,
                                    code: true,
                                    status: true
                                }
                            }
                        }
                    }
                }
            });


        return {
            ...updatedQuestion,

            tags:
                updatedQuestion.tags.map(
                    ({ tag }) => tag
                ),

            languages:
                updatedQuestion.languages.map(
                    ({
                        languageId,
                        starterCode,
                        language
                    }) => ({
                        languageId,
                        starterCode,
                        ...language
                    })
                )
        };
    });
};


// =====================================================
// DELETE QUESTION
// =====================================================

const deleteQuestion = async (id) => {
    return prisma.question.delete({
        where: {
            id
        }
    });
};


// =====================================================
// QUESTION TAG
// =====================================================

const createQuestionTag = async (
    questionId,
    tagId
) => {
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


const findQuestionTag = async (
    questionId,
    tagId
) => {
    return prisma.questionTag.findUnique({
        where: {
            questionId_tagId: {
                questionId,
                tagId
            }
        }
    });
};


const findQuestionTags = async (
    questionId
) => {
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


const deleteQuestionTag = async (
    questionId,
    tagId
) => {
    return prisma.questionTag.delete({
        where: {
            questionId_tagId: {
                questionId,
                tagId
            }
        }
    });
};


// =====================================================
// LANGUAGE
// =====================================================

// Kept here because your current question service
// uses questionRepository.findLanguageById().

const findLanguageById = async (
    languageId
) => {
    return prisma.language.findUnique({
        where: {
            id: languageId
        },

        select: {
            id: true,
            name: true,
            code: true,
            status: true
        }
    });
};


// =====================================================
// QUESTION LANGUAGE
// =====================================================

const findQuestionLanguage = async (
    questionId,
    languageId
) => {
    return prisma.questionLanguage.findUnique({
        where: {
            questionId_languageId: {
                questionId,
                languageId
            }
        }
    });
};


const createQuestionLanguage = async (
    questionId,
    languageId,
    starterCode
) => {
    return prisma.questionLanguage.create({
        data: {
            questionId,
            languageId,
            starterCode
        },

        select: {
            questionId: true,
            languageId: true,
            starterCode: true,

            language: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                    status: true
                }
            }
        }
    });
};


const findQuestionLanguages = async (
    questionId
) => {
    return prisma.questionLanguage.findMany({
        where: {
            questionId
        },

        orderBy: {
            createdAt: "asc"
        },

        select: {
            questionId: true,
            languageId: true,
            starterCode: true,

            language: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                    status: true
                }
            }
        }
    });
};


const updateQuestionLanguage = async (
    questionId,
    languageId,
    data
) => {
    return prisma.questionLanguage.update({
        where: {
            questionId_languageId: {
                questionId,
                languageId
            }
        },

        data,

        select: {
            questionId: true,
            languageId: true,
            starterCode: true,

            language: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                    status: true
                }
            }
        }
    });
};


const deleteQuestionLanguage = async (
    questionId,
    languageId
) => {
    return prisma.questionLanguage.delete({
        where: {
            questionId_languageId: {
                questionId,
                languageId
            }
        }
    });
};


// =====================================================
// EXPORTS
// =====================================================

module.exports = {
    createQuestion,

    findQuestionById,
    findQuestions,

    updateQuestion,
    deleteQuestion,

    // Tags
    createQuestionTag,
    findQuestionTag,
    findQuestionTags,
    deleteQuestionTag,

    // Language
    findLanguageById,

    // Question Languages
    createQuestionLanguage,
    findQuestionLanguage,
    findQuestionLanguages,
    updateQuestionLanguage,
    deleteQuestionLanguage
};