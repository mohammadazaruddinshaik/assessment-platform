const ApiError = require("../../utils/api-error");
const questionRepository = require("./question.repository");

const createQuestion = async (data) => {
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

const listQuestions = async ({
    page = 1,
    limit = 20,
    search,
    questionType,
    difficulty,
    status,
    categoryId,
    tagId
}) => {
    const where = {};

    if (search) {
        where.title = {
            contains: search,
            mode: "insensitive"
        };
    }

    if (questionType) {
        where.questionType = questionType;
    }

    if (difficulty) {
        where.difficulty = difficulty;
    }

    if (status) {
        where.status = status;
    }

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

    const skip = (page - 1) * limit;

    const { questions, total } =
        await questionRepository.findQuestions({
            where,
            skip,
            take: limit
        });

    return {
        questions: questions.map((question) => ({
            ...question,
            tags: question.tags.map((item) => item.tag)
        })),

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
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

    return questionRepository.updateQuestion(
        questionId,
        {
            ...data,
            updatedBy: "system"
        }
    );
};

module.exports = {
    createQuestion,
    getQuestionById,
    listQuestions,
    updateQuestion
};