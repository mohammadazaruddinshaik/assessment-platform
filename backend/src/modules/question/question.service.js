const ApiError = require("../../utils/api-error");

const questionRepository = require("./question.repository");
const tagRepository = require("../tag/tag.repository");
const categoryRepository = require("../category/category.repository");
const languageRepository = require("../language/language.repository");

const createQuestion = async (data) => {
    if (data.categoryId) {
        const category =
            await categoryRepository.findCategoryById(
                data.categoryId
            );

        if (!category) {
            throw new ApiError(
                404,
                "Category not found",
                "CATEGORY_NOT_FOUND"
            );
        }
    }

    if (data.tagIds?.length) {
        for (const tagId of data.tagIds) {
            const tag =
                await tagRepository.findTagById(tagId);

            if (!tag) {
                throw new ApiError(
                    404,
                    "Tag not found",
                    "TAG_NOT_FOUND"
                );
            }
        }
    }


    if (data.languages?.length) {
        for (const item of data.languages) {
            const language =
                await languageRepository.findLanguageById(
                    item.languageId
                );

            if (!language) {
                throw new ApiError(
                    404,
                    "Language not found",
                    "LANGUAGE_NOT_FOUND"
                );
            }

            if (language.status !== "ACTIVE") {
                throw new ApiError(
                    409,
                    "Language is inactive",
                    "LANGUAGE_NOT_ACTIVE"
                );
            }
        }
    }

    return questionRepository.createQuestion({
        ...data,
        createdBy: "system",
        updatedBy: "system"
    });
};

const getQuestionById = async (questionId) => {
    const question = await questionRepository.findQuestionById(questionId);

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    return question;
};


const listQuestions = async (filters) => {
    const {
        categoryId,
        tagId,
        difficulty,
        questionType,
        status,
        search,
        page,
        limit
    } = filters;

    const where = {};

    if (categoryId) {
        where.categoryId = categoryId;
    }

    if (tagId) {
        where.tags = {
            some: {
                tagId
            }
        };
    }

    if (difficulty) {
        where.difficulty = difficulty;
    }

    if (questionType) {
        where.questionType = questionType;
    }

    if (status) {
        where.status = status;
    }

    if (search) {
        where.OR = [
            {
                title: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                description: {
                    contains: search,
                    mode: "insensitive"
                }
            },
            {
                constraints: {
                    contains: search,
                    mode: "insensitive"
                }
            }
        ];
    }

    const skip = (page - 1) * limit;

    const result = await questionRepository.findQuestions({
        where,
        skip,
        take: limit
    });

    return {
        items: result.questions,
        pagination: {
            page,
            limit,
            total: result.total,
            totalPages: Math.ceil(result.total / limit)
        }
    };
};

const updateQuestion = async (questionId, data) => {
    const existingQuestion =
        await questionRepository.findQuestionById(questionId);

    if (!existingQuestion) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    // -----------------------------------------
    // Validate category
    // -----------------------------------------

    if (data.categoryId) {
        const category =
            await categoryRepository.findCategoryById(
                data.categoryId
            );

        if (!category) {
            throw new ApiError(
                404,
                "Category not found",
                "CATEGORY_NOT_FOUND"
            );
        }
    }

    // -----------------------------------------
    // Validate tags
    // -----------------------------------------

    if (data.tagIds) {
        for (const tagId of data.tagIds) {
            const tag =
                await tagRepository.findTagById(tagId);

            if (!tag) {
                throw new ApiError(
                    404,
                    "Tag not found",
                    "TAG_NOT_FOUND"
                );
            }
        }
    }

    // -----------------------------------------
    // Validate languages
    // -----------------------------------------

    if (data.languages) {
        for (const item of data.languages) {
            const language =
                await languageRepository.findLanguageById(
                    item.languageId
                );

            if (!language) {
                throw new ApiError(
                    404,
                    "Language not found",
                    "LANGUAGE_NOT_FOUND"
                );
            }

            if (language.status !== "ACTIVE") {
                throw new ApiError(
                    409,
                    "Language is inactive",
                    "LANGUAGE_NOT_ACTIVE"
                );
            }
        }
    }

    return questionRepository.updateQuestion(
        questionId,
        {
            ...data,
            updatedBy: "system"
        }
    );
};

const deleteQuestion = async (questionId) => {
    const existingQuestion =
        await questionRepository.findQuestionById(questionId);

    if (!existingQuestion) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    await questionRepository.deleteQuestion(questionId);
};

const addTagToQuestion = async (questionId, tagId) => {
    const question =
        await questionRepository.findQuestionById(questionId);

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    const tag =
        await tagRepository.findTagById(tagId);

    if (!tag) {
        throw new ApiError(
            404,
            "Tag not found",
            "TAG_NOT_FOUND"
        );
    }

    const existingQuestionTag =
        await questionRepository.findQuestionTag(
            questionId,
            tagId
        );

    if (existingQuestionTag) {
        throw new ApiError(
            409,
            "Tag is already associated with this question",
            "QUESTION_TAG_ALREADY_EXISTS"
        );
    }

    return questionRepository.createQuestionTag(
        questionId,
        tagId
    );
};


const getQuestionTags = async (questionId) => {
    const question =
        await questionRepository.findQuestionById(questionId);

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    const questionTags =
        await questionRepository.findQuestionTags(questionId);

    return questionTags.map((item) => item.tag);
};


const removeTagFromQuestion = async (questionId, tagId) => {
    const question =
        await questionRepository.findQuestionById(questionId);

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    const tag =
        await tagRepository.findTagById(tagId);

    if (!tag) {
        throw new ApiError(
            404,
            "Tag not found",
            "TAG_NOT_FOUND"
        );
    }

    const questionTag =
        await questionRepository.findQuestionTag(
            questionId,
            tagId
        );

    if (!questionTag) {
        throw new ApiError(
            404,
            "Tag is not associated with this question",
            "QUESTION_TAG_NOT_FOUND"
        );
    }

    await questionRepository.deleteQuestionTag(
        questionId,
        tagId
    );
};


const addLanguageToQuestion = async (questionId, data) => {
    const question =
        await questionRepository.findQuestionById(questionId);

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    const language =
        await questionRepository.findLanguageById(
            data.languageId
        );

    if (!language) {
        throw new ApiError(
            404,
            "Language not found",
            "LANGUAGE_NOT_FOUND"
        );
    }

    if (language.status !== "ACTIVE") {
        throw new ApiError(
            409,
            "Language is inactive",
            "LANGUAGE_NOT_ACTIVE"
        );
    }

    const existingQuestionLanguage =
        await questionRepository.findQuestionLanguage(
            questionId,
            data.languageId
        );

    if (existingQuestionLanguage) {
        throw new ApiError(
            409,
            "Language is already associated with this question",
            "QUESTION_LANGUAGE_ALREADY_EXISTS"
        );
    }

    return questionRepository.createQuestionLanguage(
        questionId,
        data.languageId,
        data.starterCode
    );
};


const getQuestionLanguages = async (questionId) => {
    const question =
        await questionRepository.findQuestionById(questionId);

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    return questionRepository.findQuestionLanguages(
        questionId
    );
};


const updateQuestionLanguage = async (
    questionId,
    languageId,
    data
) => {
    const question =
        await questionRepository.findQuestionById(questionId);

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    const questionLanguage =
        await questionRepository.findQuestionLanguage(
            questionId,
            languageId
        );

    if (!questionLanguage) {
        throw new ApiError(
            404,
            "Language is not associated with this question",
            "QUESTION_LANGUAGE_NOT_FOUND"
        );
    }

    return questionRepository.updateQuestionLanguage(
        questionId,
        languageId,
        data
    );
};


const removeLanguageFromQuestion = async (
    questionId,
    languageId
) => {
    const question =
        await questionRepository.findQuestionById(questionId);

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }

    const questionLanguage =
        await questionRepository.findQuestionLanguage(
            questionId,
            languageId
        );

    if (!questionLanguage) {
        throw new ApiError(
            404,
            "Language is not associated with this question",
            "QUESTION_LANGUAGE_NOT_FOUND"
        );
    }

    await questionRepository.deleteQuestionLanguage(
        questionId,
        languageId
    );
};



module.exports = {
    createQuestion,
    getQuestionById,
    listQuestions,
    updateQuestion,
    deleteQuestion,

    addTagToQuestion,
    getQuestionTags,
    removeTagFromQuestion,

    getQuestionLanguages,
    addLanguageToQuestion,
    updateQuestionLanguage,
    removeLanguageFromQuestion
};