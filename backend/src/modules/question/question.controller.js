const questionService = require("./question.service");
const ApiResponse = require("../../utils/api-response");

const createQuestion = async (req, res) => {
    const question = await questionService.createQuestion(
        req.validated.body
    );

    return ApiResponse.created(
        res,
        question,
        "Question created successfully"
    );
};

const getQuestionById = async (req, res) => {
    const question = await questionService.getQuestionById(
        req.validated.params.questionId
    );

    return ApiResponse.success(
        res,
        question,
        "Question fetched successfully"
    );
};

const listQuestions = async (req, res) => {
    const result = await questionService.listQuestions(
        req.validated.query
    );

    return ApiResponse.success(
        res,
        result,
        "Questions fetched successfully"
    );
};

const updateQuestion = async (req, res) => {
    const question = await questionService.updateQuestion(
        req.validated.params.questionId,
        req.validated.body
    );

    return ApiResponse.success(
        res,
        question,
        "Question updated successfully"
    );
};


const deleteQuestion = async (req, res) => {
    await questionService.deleteQuestion(
        req.validated.params.questionId
    );

    return ApiResponse.success(
        res,
        null,
        "Question deleted successfully"
    );
};

const addTagToQuestion = async (req, res) => {
    const questionTag =
        await questionService.addTagToQuestion(
            req.validated.params.questionId,
            req.validated.body.tagId
        );

    return ApiResponse.created(
        res,
        questionTag,
        "Tag added to question successfully"
    );
};


const getQuestionTags = async (req, res) => {
    const tags = await questionService.getQuestionTags(
        req.validated.params.questionId
    );

    return ApiResponse.success(
        res,
        tags,
        "Question tags fetched successfully"
    );
};


const removeTagFromQuestion = async (req, res) => {
    await questionService.removeTagFromQuestion(
        req.validated.params.questionId,
        req.validated.params.tagId
    );

    return ApiResponse.success(
        res,
        null,
        "Tag removed from question successfully"
    );
};


const addLanguageToQuestion = async (req, res) => {
    const questionLanguage =
        await questionService.addLanguageToQuestion(
            req.validated.params.questionId,
            req.validated.body
        );

    return ApiResponse.created(
        res,
        questionLanguage,
        "Language added to question successfully"
    );
};


const getQuestionLanguages = async (req, res) => {
    const languages =
        await questionService.getQuestionLanguages(
            req.validated.params.questionId
        );

    return ApiResponse.success(
        res,
        languages,
        "Question languages fetched successfully"
    );
};


const updateQuestionLanguage = async (req, res) => {
    const result =
        await questionService.updateQuestionLanguage(
            req.validated.params.questionId,
            req.validated.params.languageId,
            req.validated.body
        );

    return ApiResponse.success(
        res,
        result,
        "Question language updated successfully"
    );
};

const removeLanguageFromQuestion = async (req, res) => {
    await questionService.removeLanguageFromQuestion(
        req.validated.params.questionId,
        req.validated.params.languageId
    );

    return ApiResponse.success(
        res,
        null,
        "Language removed from question successfully"
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

    addLanguageToQuestion,
    getQuestionLanguages,
    updateQuestionLanguage,
    removeLanguageFromQuestion
};