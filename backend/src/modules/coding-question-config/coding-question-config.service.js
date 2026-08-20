const ApiError = require("../../utils/api-error");

const codingQuestionConfigRepository =
    require("./coding-question-config.repository");

const questionRepository =
    require("../question/question.repository");


// =====================================================
// CREATE
// =====================================================

const createCodingQuestionConfig = async (
    questionId,
    data
) => {
    const question =
        await questionRepository.findQuestionById(
            questionId
        );

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }


    if (question.questionType !== "CODING") {
        throw new ApiError(
            409,
            "Coding configuration can only be added to a coding question",
            "INVALID_QUESTION_TYPE"
        );
    }


    const existingConfig =
        await codingQuestionConfigRepository
            .findByQuestionId(questionId);

    if (existingConfig) {
        throw new ApiError(
            409,
            "Coding configuration already exists for this question",
            "CODING_CONFIG_ALREADY_EXISTS"
        );
    }


    return codingQuestionConfigRepository.create(
        questionId,
        data
    );
};


// =====================================================
// GET
// =====================================================

const getCodingQuestionConfig = async (
    questionId
) => {
    const question =
        await questionRepository.findQuestionById(
            questionId
        );

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }


    const config =
        await codingQuestionConfigRepository
            .findByQuestionId(questionId);

    if (!config) {
        throw new ApiError(
            404,
            "Coding configuration not found",
            "CODING_CONFIG_NOT_FOUND"
        );
    }


    return config;
};


// =====================================================
// UPDATE
// =====================================================

const updateCodingQuestionConfig = async (
    questionId,
    data
) => {
    const question =
        await questionRepository.findQuestionById(
            questionId
        );

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }


    const existingConfig =
        await codingQuestionConfigRepository
            .findByQuestionId(questionId);

    if (!existingConfig) {
        throw new ApiError(
            404,
            "Coding configuration not found",
            "CODING_CONFIG_NOT_FOUND"
        );
    }


    return codingQuestionConfigRepository.update(
        questionId,
        data
    );
};


// =====================================================
// DELETE
// =====================================================

const deleteCodingQuestionConfig = async (
    questionId
) => {
    const question =
        await questionRepository.findQuestionById(
            questionId
        );

    if (!question) {
        throw new ApiError(
            404,
            "Question not found",
            "QUESTION_NOT_FOUND"
        );
    }


    const existingConfig =
        await codingQuestionConfigRepository
            .findByQuestionId(questionId);

    if (!existingConfig) {
        throw new ApiError(
            404,
            "Coding configuration not found",
            "CODING_CONFIG_NOT_FOUND"
        );
    }


    await codingQuestionConfigRepository.remove(
        questionId
    );
};


module.exports = {
    createCodingQuestionConfig,
    getCodingQuestionConfig,
    updateCodingQuestionConfig,
    deleteCodingQuestionConfig
};