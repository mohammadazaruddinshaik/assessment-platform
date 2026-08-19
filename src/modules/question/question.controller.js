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

    return res.status(200).json({
        success: true,
        message: "Questions fetched successfully",
        data: result.questions,
        pagination: result.pagination
    });
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

module.exports = {
    createQuestion,
    getQuestionById,
    listQuestions,
    updateQuestion
};